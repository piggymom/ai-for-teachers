import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =============================================================================
// TTS CACHING - In-memory cache for audio responses
// Cache key = hash(text + voice), stores ArrayBuffer
// =============================================================================
const ttsCache = new Map<string, { audio: ArrayBuffer; timestamp: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 50; // Max cached items

function getCacheKey(text: string, voice: string): string {
  return crypto.createHash("sha256").update(`${voice}:${text}`).digest("hex");
}

function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of ttsCache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS) {
      ttsCache.delete(key);
    }
  }
  // If still too large, remove oldest entries
  if (ttsCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(ttsCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => ttsCache.delete(key));
  }
}

/**
 * OpenAI TTS API route for Skippy voice output.
 *
 * VOICE CONFIGURATION:
 * Set OPENAI_TTS_VOICE in .env.local to change the voice.
 *
 * Available voices:
 * - "alloy": neutral, balanced (American)
 * - "echo": warm, conversational (American)
 * - "fable": expressive, British accent (DEFAULT - UK)
 * - "onyx": deep, authoritative (American)
 * - "nova": warm, friendly (American)
 * - "shimmer": clear, expressive (American)
 *
 * Default is "fable" for British accent.
 */
type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

function getVoice(): TTSVoice {
  const envVoice = process.env.OPENAI_TTS_VOICE;
  const validVoices: TTSVoice[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

  if (envVoice && validVoices.includes(envVoice as TTSVoice)) {
    return envVoice as TTSVoice;
  }

  // Default to "fable" for British accent
  return "fable";
}

/**
 * Safety guard: Strip any instruction-like text that shouldn't be spoken.
 * This is a fallback - ideally the upstream should never send such text.
 */
function sanitizeForSpeech(text: string): string {
  // Patterns that indicate system instructions (case-insensitive)
  const instructionPatterns = [
    /^read in a[n]?\s/i,
    /^say (this |the following )?in\s/i,
    /^speak (this |the following )?in\s/i,
    /^use a[n]?\s.*\s(voice|accent|tone)/i,
    /^voice:/i,
    /^accent:/i,
    /^tone:/i,
    /^style:/i,
    /\(.*accent.*\)/gi,
    /\(.*voice.*\)/gi,
    /\[.*accent.*\]/gi,
    /\[.*voice.*\]/gi,
  ];

  let sanitized = text;

  // Remove lines that look like instructions
  const lines = sanitized.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    // Check if line matches any instruction pattern
    return !instructionPatterns.some(pattern => pattern.test(trimmed));
  });

  sanitized = filteredLines.join('\n').trim();

  // If we stripped everything, return original (better to speak something)
  if (!sanitized) {
    console.warn("TTS sanitization stripped all content, using original");
    return text.trim();
  }

  return sanitized;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Sanitize text - remove any instruction-like content
    const sanitizedText = sanitizeForSpeech(text);
    const voice = getVoice();
    const cacheKey = getCacheKey(sanitizedText, voice);

    // Check cache first
    const cached = ttsCache.get(cacheKey);
    if (cached) {
      console.log(`[TTS TIMING] Cache HIT - ${Date.now() - startTime}ms`);
      return new NextResponse(cached.audio, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": cached.audio.byteLength.toString(),
          "X-TTS-Cache": "HIT",
        },
      });
    }

    // Cache miss - call OpenAI TTS API
    const response = await openai.audio.speech.create({
      model: "tts-1", // Use "tts-1-hd" for higher quality (slower, more expensive)
      voice,
      input: sanitizedText,
      response_format: "mp3",
    });

    // Get audio as ArrayBuffer and cache it
    const audioBuffer = await response.arrayBuffer();

    // Store in cache
    cleanupCache();
    ttsCache.set(cacheKey, { audio: audioBuffer, timestamp: Date.now() });

    console.log(`[TTS TIMING] Cache MISS - ${Date.now() - startTime}ms (cached for next time)`);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "X-TTS-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
