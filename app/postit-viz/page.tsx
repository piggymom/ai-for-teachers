"use client";

import { useState, useEffect } from "react";

// New Visions brand colors — indigo blue dominant, red + purple accents
const NV = {
  blue: "#4A50BF",
  red: "#C8102E",
  purple: "#6B2D8B",
  blueLight: "#ECEDF9",
  bluePale: "#F5F5FB",
  redLight: "#FBE8EC",
  purpleLight: "#F3ECF8",
  blueMid: "#7B80D4",
  redMid: "#E8788A",
  purpleMid: "#A87FC4",
  orange: "#D4853A",
  dark: "#2D2F5E",
  text: "#33355A",
  textMid: "#666889",
  textLight: "#9496AD",
  bg: "#F8F8FC",
  card: "#FFFFFF",
  border: "#E2E3EF",
  borderLight: "#EEEEF6",
};

type Framework = "technical" | "market" | "self";
type Cluster = "privacy" | "ethics" | "schools" | "policy" | "practical" | "parenting" | "sustainability" | "power" | "identity";

interface Question {
  id: number;
  text: string;
  cluster: Cluster;
  framework: Framework;
  response: string;
}

const questions: Question[] = [
  { id: 1, text: "How can AI help me with particularly challenged students?", cluster: "schools", framework: "technical", response: "AI can serve as a differentiation engine — generating multiple versions of the same content at different reading levels, creating scaffolded practice problems, or producing visual/audio alternatives for the same concept. For students with IEPs, AI can help draft progress monitoring notes or suggest intervention strategies based on documented needs. The key is using AI to multiply your capacity as a teacher, not to replace the relational judgment that makes your support effective. You still decide what 'help' looks like; AI handles the production bottleneck." },
  { id: 2, text: "How can I use AI without it taking my data if I don't want AI to use it?", cluster: "privacy", framework: "market", response: "This depends entirely on which tool you're using and what its terms of service say — which is itself a market literacy skill. Some tools use your inputs to train future models unless you opt out. Others contractually prohibit training on your data. Practical steps: use enterprise/school-licensed versions when available, avoid entering student PII into any AI tool, read the data usage section of terms of service, and check whether your district has a data privacy agreement with the vendor." },
  { id: 3, text: "How can we improve our eco-conscious use of AI?", cluster: "sustainability", framework: "market", response: "AI's environmental footprint comes from two places: training (massive, one-time) and inference (smaller per query, but billions of queries add up). You can be more conscious by using the smallest model that gets the job done, batching requests rather than running many small ones, choosing providers who disclose their energy sourcing, and simply asking 'do I actually need AI for this?' before every use. But individual behavior change is a tiny lever — the real action is in corporate accountability and energy policy, which brings this squarely into market literacy territory." },
  { id: 4, text: "How can we increase inclusion at New Visions or this school?", cluster: "schools", framework: "self", response: "AI can lower barriers to participation — translation tools for multilingual families, speech-to-text for students with disabilities, content adaptation for different learning profiles. But inclusion is fundamentally about who gets to be in the room and whose voice gets heard, and AI doesn't solve that. The deeper question is whether AI tools are being deployed equitably across schools, whether the people designing AI-driven programs reflect the communities they serve, and whether 'AI inclusion' means genuine participation or just more efficient compliance." },
  { id: 5, text: "How can we use AI in our schools to improve outcomes for students?", cluster: "schools", framework: "technical", response: "The highest-leverage uses right now are reducing teacher administrative burden (feedback drafting, lesson planning, communication) so teachers can spend more time on instruction and relationships. AI can also personalize practice and provide immediate feedback to students on low-stakes tasks. Be cautious about AI for high-stakes assessment or behavioral monitoring — those carry significant equity risks. Start with the question 'what takes teachers the most time for the least instructional value?' and apply AI there first." },
  { id: 6, text: "How do I decide which AI tool to use for what purpose?", cluster: "practical", framework: "technical", response: "Start with the task, not the tool. Writing tasks? A large language model like Claude or ChatGPT. Image creation? Midjourney, DALL-E, or similar. Data analysis? Code-capable models or specialized tools. Then evaluate on three dimensions: quality of output for your specific use case, data privacy policies, and cost/access. Don't chase the newest tool — find one that works reliably for your most frequent needs and develop real skill with it before expanding your toolkit." },
  { id: 7, text: "How do I understand the AI policy working in my school?", cluster: "policy", framework: "market", response: "Start by asking your administration directly: does our school or district have an AI use policy? If yes, read it with these questions in mind: what tools are approved, what data can I input, what uses are prohibited, and who do I go to with questions? If no policy exists, that's actually important information too — it means you're operating in a gray zone and should be conservative with student data. Advocating for a clear policy is itself a form of AI literacy leadership." },
  { id: 8, text: "How does AI/technology look in schools for students?", cluster: "schools", framework: "technical", response: "Right now it's highly variable — some schools have students using AI as a writing partner or research tool, others ban it entirely. The most thoughtful implementations treat AI as a thinking tool rather than an answer machine: students use it to brainstorm, get feedback on drafts, explore 'what if' questions, or practice skills with immediate feedback. What it should look like is students developing critical judgment about when and how AI is useful to their learning." },
  { id: 9, text: "How is it possible to have access to AI?", cluster: "practical", framework: "technical", response: "Most major AI tools have free tiers: ChatGPT, Claude, Gemini, and Microsoft Copilot are all accessible via web browser with just an email address. Many school districts are also negotiating enterprise licenses that provide safer, more private access. The access question is less about 'can I get to it' and more about 'can I get to a version that's appropriate for my context' — free tools have different data policies than paid/enterprise versions, and that matters when you're working with student information." },
  { id: 10, text: "How long will AI resources and communities last? How short-lived are current tools?", cluster: "sustainability", framework: "market", response: "This is one of the sharpest market literacy questions on the board. AI tools have an extremely high churn rate — products launch, pivot, get acquired, or shut down constantly. Building your practice around a single tool is risky. The more durable investment is in developing transferable skills: prompt craft, critical evaluation of AI output, understanding what these systems can and can't do. Those skills transfer across tools even when specific products disappear. Communities of practice (like what you're building here) are also more durable than any one platform." },
  { id: 11, text: "How many types of codes were/are used to generate?", cluster: "practical", framework: "technical", response: "Modern AI models are primarily built on neural network architectures, with the dominant approach being 'transformers' (the architecture behind GPT, Claude, Gemini, etc.). These are trained using Python and frameworks like PyTorch or TensorFlow, running on specialized hardware (GPUs and TPUs). But you don't need to know how to code to use AI effectively — that's like saying you need to understand internal combustion to drive a car. The more useful knowledge is understanding what these systems are optimized to do (predict plausible next tokens) versus what people assume they do (think, know, understand)." },
  { id: 12, text: "How might we protect against unconscious bias when using AI, especially with student info?", cluster: "privacy", framework: "market", response: "AI systems inherit biases from their training data and from the humans who design them. With student info, this is especially dangerous because biased outputs can reinforce inequitable patterns in discipline, tracking, and opportunity. Practical protections: never use AI as a sole decision-maker for anything that affects a student's trajectory; always have a human with context review AI-generated assessments or recommendations; be especially skeptical when AI outputs align too neatly with existing stereotypes; and audit who is and isn't being well-served by AI tools you adopt." },
  { id: 13, text: "How much are we really destroying the earth with AI?", cluster: "sustainability", framework: "market", response: "It's real but proportional. Training a single large language model can emit hundreds of tons of CO2 — comparable to several cars' lifetime emissions. Data centers consume enormous amounts of water and electricity. But AI's footprint is still a fraction of industries like aviation, agriculture, or fossil fuels. The honest answer is: AI's environmental cost is non-trivial, it's growing fast, and the industry is not being transparent enough about it. It deserves scrutiny, but 'destroying the earth' overstates where we are. The bigger concern is the trajectory if current growth continues unchecked." },
  { id: 14, text: "How much other data is really used?", cluster: "privacy", framework: "market", response: "Large language models are trained on massive datasets — often hundreds of billions of words scraped from the internet, books, academic papers, code repositories, and more. This includes copyrighted material, personal blog posts, forum discussions, and potentially private information that was publicly accessible. When you use a tool, your inputs may or may not be used for further training depending on the product and your settings. The honest answer is: more data than most people realize, collected with less consent than most people would be comfortable with." },
  { id: 15, text: "How should I guide my kids in using AI?", cluster: "parenting", framework: "technical", response: "The same way you'd guide them with any powerful tool: supervised exposure with increasing independence as they develop judgment. Start by using AI together so you can model critical evaluation — ask it something, then talk about whether the answer is good, what it might have gotten wrong, and how you'd verify it. Emphasize that AI is a thinking partner, not an authority. Set clear boundaries about not sharing personal information. And most importantly, help them develop the skills AI can't replace: asking good questions, caring about what's true, and knowing when a human perspective matters more." },
  { id: 16, text: "How should we teach our kids to effectively use AI?", cluster: "parenting", framework: "technical", response: "Effective AI use isn't just prompt engineering — it's knowing when to use AI, when not to, and how to evaluate what it gives you. Teach students to: clearly define what they need before turning to AI; treat AI output as a first draft that requires their judgment; verify factual claims independently; recognize when AI is confidently wrong; and articulate what they themselves contributed to any AI-assisted work. The goal is building capacity, not dependency — students should feel more capable after using AI, not less capable without it." },
  { id: 17, text: "How sustainable is AI for the future of education?", cluster: "schools", framework: "self", response: "This question has two layers: environmental sustainability (covered elsewhere) and institutional sustainability. On the institutional side, the risk is real — schools adopting AI tools that require ongoing subscriptions, that get discontinued, or that create dependencies without building internal capacity. Sustainable AI in education means: choosing tools with clear long-term viability, building educator skill that transfers across platforms, maintaining the ability to function without AI, and ensuring AI adoption serves educational values rather than vendor interests." },
  { id: 18, text: "What are well-intentioned but ethical pitfalls?", cluster: "ethics", framework: "self", response: "The biggest one: using AI to 'help' in ways that actually remove agency. Writing feedback 'for' teachers instead of building their feedback capacity. Personalizing learning in ways that narrow rather than expand what students encounter. Collecting data to 'support' students that actually enables surveillance. Using AI to make processes more 'efficient' when the inefficiency was actually where the human judgment lived. Good intentions don't prevent harm — the question is always 'who benefits, who is affected, and did they have a say?'" },
  { id: 19, text: "What does AI literacy look like in schools?", cluster: "schools", framework: "technical", response: "Most current frameworks focus on technical skills: how to use tools, how to write prompts, how to evaluate output. That's necessary but wildly insufficient. Real AI literacy in schools also includes market literacy (who makes these tools, who profits, what are the business models, what happens to your data) and self-literacy (how does AI use change how I think, what I value, and who I am as a learner). A school with genuine AI literacy doesn't just teach students to use ChatGPT — it teaches them to ask why ChatGPT exists, who it serves, and what it costs." },
  { id: 20, text: "What do you do when AI gets something wrong?", cluster: "practical", framework: "technical", response: "First: expect it. AI systems produce plausible-sounding output that is frequently inaccurate, especially on specific facts, citations, math, and anything requiring real-world verification. When you catch an error, don't just correct and move on — treat it as data. What kind of error was it? (Factual, logical, biased, outdated?) Was it the kind of error you could easily catch, or did it require expertise? This builds your intuition for where AI is reliable and where it isn't. And if you're using AI output in a professional context, verification isn't optional — it's the whole job." },
  { id: 21, text: "What rules or practices should govern AI use, and who decides to what extent?", cluster: "policy", framework: "market", response: "This is fundamentally a governance question, and right now the answer is 'it's a mess.' At the federal level, regulation is nascent. At the district level, policies are uneven. At the school level, it often comes down to individual principal or teacher decisions. Who should decide? Ideally, the people most affected — educators, students, families — should have meaningful input, not just top-down mandates from administrators or vendors. Good AI governance in schools is participatory, transparent, revisable, and grounded in educational values rather than efficiency metrics." },
  { id: 22, text: "What would the regulation of AI look like if we were to regulate it ethically?", cluster: "ethics", framework: "market", response: "Ethical AI regulation would center transparency (companies disclosing training data, model limitations, and business models), accountability (clear liability when AI causes harm), equity (ensuring benefits and risks aren't distributed along existing lines of privilege), and consent (people having genuine choice about whether and how their data is used). In education specifically, it would mean student data protections with real teeth, independent auditing of AI tools used in schools, and requirements that AI vendors demonstrate educational benefit — not just engagement metrics — before being allowed into classrooms." },
  { id: 23, text: "Who is regulating AI, and is DEIA being considered?", cluster: "policy", framework: "market", response: "In the U.S., regulation is fragmented: the EU has the AI Act, the most comprehensive framework so far. The U.S. has executive orders and agency-level guidance but no comprehensive federal legislation yet. At the state level, it varies widely. Is DEIA being considered? In principle, yes — most frameworks mention bias and equity. In practice, the people writing regulation are overwhelmingly from industry and government, with limited representation from the communities most affected by AI harms. The gap between stated equity commitments and actual regulatory power is wide." },
  { id: 24, text: "Who profits from AI? Who is really using it?", cluster: "power", framework: "market", response: "The primary profit flows to a very small number of companies: OpenAI/Microsoft, Google, Meta, Amazon, Anthropic, and the chip manufacturers (especially Nvidia). The investment landscape is dominated by venture capital seeking massive returns. Who's using it? Increasingly everyone, but the power asymmetry matters — corporations use AI to reduce labor costs and increase extraction, while individuals use it for productivity and convenience. The question beneath your question is the important one: is AI a tool that distributes power more broadly, or one that concentrates it further? Right now, the evidence points toward concentration." },
  { id: 25, text: "Where do all the AI models come from, and who is validating them?", cluster: "privacy", framework: "market", response: "Most major models come from a handful of well-funded companies (OpenAI, Google, Anthropic, Meta) or research labs. Validation is where it gets uncomfortable: there is no independent regulatory body that certifies AI models as safe, accurate, or appropriate for specific uses. Companies do internal testing ('red teaming,' benchmarking) but they're essentially grading their own homework. Third-party evaluations exist but are voluntary and inconsistent. For education specifically, there's no equivalent of FDA approval — any AI tool can be marketed to schools without proving it actually helps students learn." },
  { id: 26, text: "Where do you see AI in education to be most valuable?", cluster: "schools", framework: "self", response: "In reducing the administrative burden that steals time from actual teaching. Observation feedback drafting (like TimeSaveAI), lesson planning, parent communication, IEP documentation, data analysis — these are tasks where AI can genuinely give teachers hours back without compromising the relational core of education. I'm more cautious about AI directly interacting with students, not because it can't be useful, but because the incentive structures of AI companies don't necessarily align with what's best for learners. The most valuable use is the one that makes humans better at being human in schools." },
  { id: 27, text: "Where was the data used to train AI sourced from, and did people consent?", cluster: "privacy", framework: "market", response: "Mostly scraped from the public internet without explicit consent. Books, websites, forum posts, social media, academic papers, code — all hoovered up at scale under the argument that publicly accessible means freely usable. This is legally contested (multiple lawsuits are ongoing) and ethically dubious. Most people whose writing trained these models had no idea it would be used this way and received no compensation. This is a foundational market literacy issue: the entire AI industry is built on an extraction model that most people don't understand and didn't agree to." },
  { id: 28, text: "Why can't AI hack all student loan companies and eliminate all our debt?", cluster: "ethics", framework: "market", response: "This is a perfect question because it reveals the gap between what people imagine AI can do and what power structures actually allow. Technically, AI could analyze and find vulnerabilities in financial systems. But 'can' and 'may' are different words — there are legal, ethical, and structural barriers. More importantly, the question exposes a real frustration: if AI is so powerful, why does it seem to only make powerful institutions more powerful rather than solving the problems regular people actually have? That's not a technical limitation — it's a market and power question about who AI is built to serve." },
  { id: 29, text: "Why do I feel like I am cheating/not ethical when I use AI?", cluster: "ethics", framework: "self", response: "Because you have integrity, and the norms haven't caught up yet. You were trained (as a professional, as a student, as a person) in a world where the work product was evidence of the cognitive process. When AI can produce the output without you doing the thinking, it creates genuine moral dissonance: did I earn this? Is this mine? Am I being honest? That discomfort is actually valuable — it means you're taking seriously the question of what your own contribution should be. The answer isn't 'stop feeling guilty' — it's to develop a clear personal ethic about where you add value that AI doesn't." },
  { id: 30, text: "Why do I feel unsettled when I think about being replaced by AI?", cluster: "identity", framework: "self", response: "Because your professional identity is wrapped up in skills you spent years developing, and watching a machine approximate those skills in seconds is existentially disorienting. That feeling is rational, not irrational — it's your nervous system recognizing a genuine threat to your sense of purpose and value. The productive move isn't to suppress the feeling or to be reassured that 'AI won't replace you.' It's to sit with the discomfort and use it to clarify what you do that actually matters — the parts of your work that are irreducibly human. That's where your value lives." },
  { id: 31, text: "When is the AI bubble likely to burst, and what does that mean?", cluster: "power", framework: "market", response: "There are credible voices on both sides. The 'bubble' argument: current AI investment far exceeds current AI revenue; many AI startups have no path to profitability; the hype cycle is outpacing demonstrated value. The 'not a bubble' argument: the technology is genuinely transformative and adoption is accelerating. If the bubble does burst, it likely means: some companies fold, investment slows, free tools become paid, and the most overhyped applications disappear — but the core technology doesn't go away. For education, this means being cautious about building dependencies on tools that might not survive a funding correction." },
  { id: 32, text: "When is the Singularity?", cluster: "identity", framework: "self", response: "The Singularity — the hypothetical point where AI surpasses human intelligence and triggers runaway self-improvement — is a concept that ranges from serious research concern to science fiction depending on who you ask. Credible timelines range from 'never' to '10-30 years' to 'already happening slowly.' The more useful question for your daily life is: regardless of whether the Singularity arrives, AI is already changing what it means to think, work, learn, and create. You don't need to predict the endpoint to navigate the present thoughtfully." },
  { id: 33, text: "Is it really bad to be polite to AI?", cluster: "ethics", framework: "self", response: "No — but it's fascinating that you asked. Being polite to AI doesn't hurt anything (despite the viral 'it costs money' claims, the computational difference is negligible). What's interesting is what the question reveals about your relationship with the technology: you're extending social norms to a non-social entity, which says something about how human-like these interactions feel. The real question underneath is: what kind of person do I want to be in my interactions, even with machines? If being polite reflects your values, it's not bad — it's just you being you." },
  { id: 34, text: "Is there a way to opt out of AI data collection?", cluster: "privacy", framework: "market", response: "Partially, and it's harder than it should be. Most major AI tools have opt-out settings for training data use, but they're often buried in settings menus and not enabled by default. At a broader level, your data has likely already been used — if you've ever posted anything online, it's probably in a training dataset. Some tools let you check if your content was used. The deeper issue is structural: opting out puts the burden on individuals rather than requiring companies to get opt-in consent. That's a market design choice, not a technical inevitability." },
  { id: 35, text: "Is there any research around the economics of schools being able to host these systems in house?", cluster: "policy", framework: "market", response: "Some, and it's not encouraging for most schools. Running AI models locally requires significant GPU infrastructure, technical staff, and ongoing maintenance — costs that are prohibitive for individual schools and challenging even for large districts. Some districts and university systems are exploring it, and open-source models make it more feasible than it was a year ago. The economic question is really about control vs. cost: hosting in-house gives you data sovereignty and independence from vendors, but at a steep price. Consortia models — where networks like New Visions pool resources — might be the more realistic path." },
  { id: 36, text: "Is using AI to fake getting a dream job OK?", cluster: "ethics", framework: "self", response: "This is a genuinely hard ethics question with no clean answer. On one hand: everyone tailors their presentation for job applications, and using AI to polish a resume or prepare for interviews is just a tool. On the other hand: if AI is writing your cover letter, acing your skills assessment, and crafting your interview answers, what happens when you actually have to do the job? The deception isn't just about getting in — it's about the gap between what you represented and what you can deliver. The question is really about where 'putting your best foot forward' ends and 'misrepresentation' begins." },
  { id: 37, text: "Is it wise to use AI to follow your dreams — is that OK?", cluster: "identity", framework: "self", response: "Absolutely — with a caveat. If AI helps you prototype an idea, learn a new skill faster, or remove a barrier that was stopping you, that's a genuine expansion of your capacity. The caveat: if AI is doing the dreaming for you (generating the ideas, making the decisions, producing the work), then you're following AI's output, not your dream. The wisdom is in using AI as a scaffold that you eventually outgrow, not a crutch that you can't function without. Your dream should still feel like yours on the other side." },
  { id: 38, text: "Besides products like images and docs, what else can AI do?", cluster: "practical", framework: "technical", response: "The list is genuinely long: code generation and debugging, data analysis and visualization, language translation, tutoring and adaptive learning, research synthesis, scheduling and planning, accessibility tools (text-to-speech, image descriptions), music composition, video editing, scientific research, medical diagnostics support, and much more. But the more interesting framing is: AI is increasingly a general-purpose reasoning tool, not a category-specific product. The question isn't 'what can it do' but 'what problems do I have that involve processing language, images, data, or patterns?' — because that's the space AI operates in." },
  { id: 39, text: "Can AI really make good students?", cluster: "schools", framework: "self", response: "No — and the framing matters. AI can't 'make' anyone anything. It can provide resources, feedback, and practice opportunities, but a 'good student' is someone who has developed curiosity, persistence, critical thinking, and the ability to learn independently. If AI makes learning frictionless, it may actually work against some of those qualities. The better question is: can AI create conditions where more students develop as capable, confident learners? Maybe — if it's designed to build capacity rather than create dependency, and if we define 'good student' by growth and agency rather than output and compliance." },
  { id: 40, text: "Should New Visions adopt a framework / reify AI values and norms?", cluster: "policy", framework: "market", response: "Yes, and doing so would put New Visions ahead of most education organizations. A shared framework gives staff a common language for navigating AI decisions, signals organizational values to schools and partners, and creates accountability for how AI is used across the network. The key is making it a living document — revisable, informed by practitioner experience, and honest about uncertainty — rather than a compliance checklist. The questions on this wall are the raw material for that framework. These are the things your colleagues actually need guidance on." },
  { id: 41, text: "Will our jobs be replaced by AI?", cluster: "identity", framework: "self", response: "Some tasks will be automated, some jobs will change significantly, and some will disappear — but the timeline and scope are genuinely uncertain. In education specifically, the relational core of teaching (building trust, reading a room, making judgment calls about a specific child in a specific moment) is among the hardest things for AI to replicate. The tasks most at risk are the administrative, repetitive, and template-driven ones. The honest answer is: your job will probably look different in five years, and developing adaptability matters more than trying to predict exactly how." },
  { id: 42, text: "In what sense(s) should AI be used?", cluster: "ethics", framework: "self", response: "In the senses that expand human capacity without eroding human agency. AI should be used where it reduces drudgery, where it lowers barriers to participation, where it augments expert judgment with broader information, and where it frees people to do the work that requires being human. It should not be used where it replaces judgment that matters, where it makes decisions about people without their knowledge, where it concentrates power in fewer hands, or where its efficiency comes at the cost of the relationships and processes that give work meaning." },
];

const clusters: Record<Cluster, { name: string; emoji: string; color: string }> = {
  privacy: { name: "Privacy, Data & Consent", emoji: "\u{1F512}", color: NV.blue },
  ethics: { name: "Ethics & Integrity", emoji: "\u2696\uFE0F", color: NV.red },
  schools: { name: "AI in Schools & Classrooms", emoji: "\u{1F3EB}", color: NV.purple },
  policy: { name: "Policy, Governance & Org Decisions", emoji: "\u{1F4CB}", color: "#3D5A9E" },
  practical: { name: "Practical Use & Access", emoji: "\u{1F6E0}\uFE0F", color: NV.orange },
  parenting: { name: "Teaching Kids & Parenting", emoji: "\u{1F46A}", color: NV.redMid },
  sustainability: { name: "Sustainability & Environment", emoji: "\u{1F30D}", color: "#3D8B6B" },
  power: { name: "Power, Profit & the Market", emoji: "\u{1F4B0}", color: "#B8860B" },
  identity: { name: "Identity, Anxiety & the Future", emoji: "\u{1F630}", color: NV.purpleMid },
};

const frameworkMeta: Record<Framework, { name: string; color: string; light: string; mid: string; tagline: string; description: string }> = {
  technical: { name: "Technical Skills", color: NV.blue, light: NV.blueLight, mid: NV.blueMid, tagline: "How to use the tools", description: "What the typical AI literacy framework covers — prompting, tool selection, output evaluation, and practical application." },
  market: { name: "Market Literacy", color: NV.red, light: NV.redLight, mid: NV.redMid, tagline: "Who profits, who decides", description: "What most frameworks neglect — the economics, power structures, data practices, and governance behind AI systems." },
  self: { name: "Self-Literacy", color: NV.purple, light: NV.purpleLight, mid: NV.purpleMid, tagline: "Who am I becoming", description: "What almost no framework addresses — how AI affects your identity, values, judgment, and sense of self as a professional." },
};

const tabs = ["Takeaways", "Themes", "Framework", "Q&A"];

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{val}</span>;
}

function DonutChart({ data, size = 180 }: { data: { value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const strokes = data.map((d) => {
    const pct = (d.value / total) * 100;
    const offset = cumulative;
    cumulative += pct;
    return { ...d, pct, offset };
  });
  const r = 65, c = Math.PI * 2 * r;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      {strokes.map((s, i) => (
        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={s.color}
          strokeWidth="30" strokeDasharray={`${(s.pct / 100) * c} ${c}`}
          strokeDashoffset={`${-(s.offset / 100) * c}`}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "all 0.8s ease" }} />
      ))}
      <circle cx="100" cy="100" r="48" fill="#fff" />
      <text x="100" y="95" textAnchor="middle" fill={NV.dark} fontFamily="'Source Serif 4',Georgia,serif" fontSize="30" fontWeight="700">{total}</text>
      <text x="100" y="114" textAnchor="middle" fill={NV.textLight} fontFamily="'Source Sans 3',system-ui,sans-serif" fontSize="11" fontWeight="500">questions</text>
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, textAlign: "right", fontSize: 12, color: NV.textMid, fontFamily: "'Source Sans 3',system-ui,sans-serif", flexShrink: 0 }}>{d.label}</div>
          <div style={{ flex: 1, background: NV.borderLight, borderRadius: 4, height: 26, position: "relative", overflow: "hidden" }}>
            <div style={{
              width: `${(d.value / max) * 100}%`, height: "100%", background: d.color,
              borderRadius: 4, transition: "width 0.8s ease", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8, minWidth: 30
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NVBar() {
  return (
    <div style={{ display: "flex", gap: 3, height: 4, marginBottom: 20 }}>
      <div style={{ flex: 1, background: NV.red, borderRadius: 2 }} />
      <div style={{ flex: 1, background: NV.blue, borderRadius: 2 }} />
      <div style={{ flex: 1, background: NV.purple, borderRadius: 2 }} />
    </div>
  );
}

function TakeawaysTab() {
  const fwCounts: Record<Framework, number> = { technical: 0, market: 0, self: 0 };
  questions.forEach(q => fwCounts[q.framework]++);
  const total = questions.length;
  return (
    <div style={{ padding: "28px 0" }}>
      <NVBar />
      <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 26, color: NV.dark, margin: "0 0 6px", fontWeight: 700 }}>
        What People <em>Actually</em> Want to Know About AI
      </h2>
      <p style={{ color: NV.textMid, fontSize: 14, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 580 }}>
        42 questions written on post-it notes by New Visions staff during an AI literacy session.
        When people are given a blank note and asked what they really want to know, here&apos;s where the questions land.
      </p>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 32 }}>
        <DonutChart size={180} data={[
          { value: fwCounts.technical, color: NV.blue },
          { value: fwCounts.market, color: NV.red },
          { value: fwCounts.self, color: NV.purple },
        ]} />
        <div style={{ flex: 1, minWidth: 240 }}>
          {(Object.entries(frameworkMeta) as [Framework, typeof frameworkMeta[Framework]][]).map(([key, meta]) => {
            const pct = Math.round((fwCounts[key] / total) * 100);
            return (
              <div key={key} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `3px solid ${meta.color}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 30, fontWeight: 700, color: meta.color }}>
                    <AnimatedNumber target={pct} />%
                  </span>
                  <span style={{ fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 14, fontWeight: 600, color: NV.dark }}>{meta.name}</span>
                </div>
                <p style={{ fontSize: 12, color: NV.textLight, margin: "2px 0 0", lineHeight: 1.4, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{meta.tagline}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${NV.blueLight} 0%, ${NV.purpleLight} 100%)`,
        border: `1px solid ${NV.blueMid}44`, borderRadius: 10, padding: 22, marginBottom: 28
      }}>
        <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 18, color: NV.blue, marginBottom: 6, fontWeight: 600 }}>
          The Punchline
        </div>
        <p style={{ color: NV.text, fontSize: 14, lineHeight: 1.7, margin: 0, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>
          Nearly <strong>3 out of 4</strong> questions fall outside what most AI literacy frameworks actually teach.
          People don&apos;t just want to know how to use the tools — they want to understand who profits, who governs, what&apos;s at stake for their data and their planet,
          and what AI means for their identity as professionals and humans. Frameworks that stop at &ldquo;technical skills&rdquo; are answering the wrong questions.
        </p>
      </div>
      <h3 style={{ fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 14, color: NV.dark, marginBottom: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Questions by Theme</h3>
      <BarChart data={(Object.entries(clusters) as [Cluster, typeof clusters[Cluster]][]).map(([key, c]) => ({
        label: `${c.emoji} ${c.name.split(" & ")[0]}`,
        value: questions.filter(q => q.cluster === key).length,
        color: c.color,
      })).sort((a, b) => b.value - a.value)} />
    </div>
  );
}

function ThematicClustersTab() {
  const [open, setOpen] = useState<Cluster | null>(null);
  return (
    <div style={{ padding: "28px 0" }}>
      <NVBar />
      <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 26, color: NV.dark, margin: "0 0 6px" }}>9 Thematic Clusters</h2>
      <p style={{ color: NV.textMid, fontSize: 13, margin: "0 0 20px", fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>Questions grouped by the organic themes that emerged. Tap to expand.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(Object.entries(clusters) as [Cluster, typeof clusters[Cluster]][]).map(([key, c]) => {
          const qs = questions.filter(q => q.cluster === key);
          const isOpen = open === key;
          return (
            <div key={key} style={{
              background: NV.card, borderRadius: 8, border: `1px solid ${isOpen ? c.color : NV.border}`,
              overflow: "hidden", transition: "all 0.3s ease", cursor: "pointer",
              boxShadow: isOpen ? `0 2px 12px ${c.color}15` : "0 1px 3px rgba(0,0,0,0.04)"
            }} onClick={() => setOpen(isOpen ? null : key)}>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{c.emoji}</span>
                  <span style={{ fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 14, fontWeight: 600, color: NV.dark }}>{c.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: c.color, color: "#fff", borderRadius: 16, padding: "1px 9px",
                    fontSize: 12, fontWeight: 700, fontFamily: "'Source Sans 3',system-ui,sans-serif"
                  }}>{qs.length}</span>
                  <span style={{ color: NV.textLight, fontSize: 16, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>{"\u25BE"}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${NV.borderLight}` }}>
                  {qs.map((q, i) => (
                    <div key={q.id} style={{ padding: "9px 0", borderBottom: i < qs.length - 1 ? `1px solid ${NV.borderLight}` : "none", display: "flex", gap: 10 }}>
                      <span style={{ color: c.color, fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{String(q.id).padStart(2, "0")}</span>
                      <span style={{ color: NV.text, fontSize: 13, lineHeight: 1.5, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{q.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CriticalLiteracyTab() {
  const [active, setActive] = useState<Framework>("market");
  const meta = frameworkMeta[active];
  const qs = questions.filter(q => q.framework === active);
  const total = questions.length;
  return (
    <div style={{ padding: "28px 0" }}>
      <NVBar />
      <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 26, color: NV.dark, margin: "0 0 6px" }}>Critical AI Literacy Framework</h2>
      <p style={{ color: NV.textMid, fontSize: 13, margin: "0 0 20px", maxWidth: 520, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>
        Most frameworks focus on technical skills. This one argues for two additional, neglected dimensions.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {(Object.entries(frameworkMeta) as [Framework, typeof frameworkMeta[Framework]][]).map(([key, m]) => {
          const count = questions.filter(q => q.framework === key).length;
          const isActive = active === key;
          return (
            <button key={key} onClick={() => setActive(key)} style={{
              background: isActive ? m.color : NV.card,
              border: `1.5px solid ${isActive ? m.color : NV.border}`,
              color: isActive ? "#fff" : NV.textMid, borderRadius: 6, padding: "8px 14px",
              cursor: "pointer", fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6
            }}>
              {m.name}
              <span style={{
                background: isActive ? "rgba(255,255,255,0.25)" : NV.borderLight,
                borderRadius: 10, padding: "0px 7px", fontSize: 11, fontWeight: 700
              }}>{count}</span>
            </button>
          );
        })}
      </div>
      <div style={{
        background: meta.light, border: `1px solid ${meta.mid}44`, borderRadius: 10, padding: 18, marginBottom: 20
      }}>
        <div style={{ fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 11, color: meta.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          {meta.tagline}
        </div>
        <p style={{ color: NV.text, fontSize: 13, lineHeight: 1.6, margin: "0 0 10px", fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{meta.description}</p>
        <div style={{ color: meta.color, fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 24, fontWeight: 700 }}>
          {Math.round((qs.length / total) * 100)}% of all questions
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {qs.map((q) => (
          <div key={q.id} style={{
            display: "flex", gap: 10, padding: "9px 12px", alignItems: "flex-start",
            background: NV.card, borderRadius: 6, border: `1px solid ${NV.border}`,
            borderLeft: `3px solid ${meta.color}`
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: clusters[q.cluster].color,
              fontFamily: "'Source Sans 3',system-ui,sans-serif", marginTop: 2, flexShrink: 0
            }}>{clusters[q.cluster].emoji}</span>
            <span style={{ fontSize: 13, color: NV.text, lineHeight: 1.5, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{q.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QAExplorerTab() {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filterFw, setFilterFw] = useState<"all" | Framework>("all");
  const filtered = filterFw === "all" ? questions : questions.filter(q => q.framework === filterFw);
  const safeIdx = Math.min(idx, filtered.length - 1);
  const q = filtered[safeIdx];
  const cluster = clusters[q.cluster];
  const fw = frameworkMeta[q.framework];
  return (
    <div style={{ padding: "28px 0" }}>
      <NVBar />
      <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 26, color: NV.dark, margin: "0 0 6px" }}>Q&A Explorer</h2>
      <p style={{ color: NV.textMid, fontSize: 13, margin: "0 0 16px", fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>Choose a question to see a response. Filter by framework category.</p>
      <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
        {([{ key: "all" as const, label: "All", color: NV.textMid }, ...Object.entries(frameworkMeta).map(([k, m]) => ({ key: k as Framework, label: m.name, color: m.color }))]).map(f => (
          <button key={f.key} onClick={() => { setFilterFw(f.key); setIdx(0); setShowAnswer(false); }} style={{
            background: filterFw === f.key ? f.color : NV.card,
            border: `1.5px solid ${filterFw === f.key ? f.color : NV.border}`,
            color: filterFw === f.key ? "#fff" : NV.textMid, borderRadius: 5, padding: "5px 10px",
            cursor: "pointer", fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 11, fontWeight: 600, transition: "all 0.2s"
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <select
          value={safeIdx}
          onChange={(e) => { setIdx(Number(e.target.value)); setShowAnswer(false); }}
          style={{
            width: "100%", padding: "10px 36px 10px 14px", fontSize: 13,
            fontFamily: "'Source Sans 3',system-ui,sans-serif", fontWeight: 500,
            color: NV.dark, background: NV.card, border: `1.5px solid ${NV.border}`,
            borderRadius: 8, cursor: "pointer", appearance: "none",
            WebkitAppearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A50BF' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
            outline: "none", transition: "border-color 0.2s",
          }}
          onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = NV.blue; }}
          onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = NV.border; }}
        >
          {filtered.map((fq, i) => (
            <option key={fq.id} value={i}>
              {String(i + 1).padStart(2, "0")}. {fq.text.length > 75 ? fq.text.slice(0, 75) + "\u2026" : fq.text}
            </option>
          ))}
        </select>
      </div>

      <div style={{
        background: NV.card, borderRadius: 10,
        border: `1px solid ${NV.border}`, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${NV.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                background: cluster.color, color: "#fff", borderRadius: 16, padding: "2px 9px",
                fontSize: 10, fontWeight: 700, fontFamily: "'Source Sans 3',system-ui,sans-serif"
              }}>{cluster.emoji} {cluster.name}</span>
              <span style={{
                background: fw.light, color: fw.color, borderRadius: 16, padding: "2px 9px",
                fontSize: 10, fontWeight: 700, fontFamily: "'Source Sans 3',system-ui,sans-serif", border: `1px solid ${fw.mid}44`
              }}>{fw.name}</span>
            </div>
            <span style={{ color: NV.textLight, fontSize: 12, fontFamily: "'Source Sans 3',system-ui,sans-serif", fontWeight: 600 }}>
              {safeIdx + 1} / {filtered.length}
            </span>
          </div>
          <p style={{
            fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 20, color: NV.dark,
            margin: 0, lineHeight: 1.4, fontWeight: 500
          }}>&ldquo;{q.text}&rdquo;</p>
        </div>
        <div style={{ padding: "18px 20px" }}>
          {!showAnswer ? (
            <button onClick={() => setShowAnswer(true)} style={{
              background: `linear-gradient(135deg, ${NV.blue} 0%, ${NV.purple} 100%)`,
              border: "none", color: "#fff", borderRadius: 6, padding: "10px 20px",
              cursor: "pointer", fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 13, fontWeight: 600,
              width: "100%", transition: "opacity 0.2s"
            }}>Show Response</button>
          ) : (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: NV.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>Response</div>
              <p style={{ color: NV.text, fontSize: 13, lineHeight: 1.75, margin: 0, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>{q.response}</p>
            </div>
          )}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", padding: "10px 20px",
          borderTop: `1px solid ${NV.borderLight}`, background: NV.bg
        }}>
          <button onClick={() => { setIdx(Math.max(0, safeIdx - 1)); setShowAnswer(false); }}
            disabled={safeIdx === 0}
            style={{
              background: NV.card, border: `1px solid ${NV.border}`, color: safeIdx === 0 ? NV.borderLight : NV.textMid,
              borderRadius: 5, padding: "7px 14px", cursor: safeIdx === 0 ? "not-allowed" : "pointer",
              fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 12, fontWeight: 600
            }}>{"\u2190"} Previous</button>
          <button onClick={() => { setIdx(Math.min(filtered.length - 1, safeIdx + 1)); setShowAnswer(false); }}
            disabled={safeIdx === filtered.length - 1}
            style={{
              background: NV.card, border: `1px solid ${NV.border}`,
              color: safeIdx === filtered.length - 1 ? NV.borderLight : NV.textMid,
              borderRadius: 5, padding: "7px 14px", cursor: safeIdx === filtered.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 12, fontWeight: 600
            }}>Next {"\u2192"}</button>
        </div>
      </div>
    </div>
  );
}

export default function PostItVizPage() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{
      minHeight: "100vh", background: NV.bg, color: NV.text,
      fontFamily: "'Source Sans 3', system-ui, sans-serif", padding: "0 20px"
    }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ padding: "28px 0 0", marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 3, height: 5, width: 60, marginBottom: 14 }}>
            <div style={{ flex: 1, background: NV.red, borderRadius: 2 }} />
            <div style={{ flex: 1, background: NV.blue, borderRadius: 2 }} />
            <div style={{ flex: 1, background: NV.purple, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: NV.blue, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
            New Visions for Public Schools
          </div>
          <h1 style={{
            fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 34, fontWeight: 700,
            margin: "0 0 2px", lineHeight: 1.15, color: NV.dark
          }}>
            42 Questions About AI
          </h1>
          <p style={{ color: NV.textLight, fontSize: 13, margin: "0 0 20px", fontWeight: 500 }}>
            A Critical AI Literacy Analysis
          </p>
        </div>
        <div style={{
          display: "flex", gap: 2, borderBottom: `2px solid ${NV.border}`,
          marginBottom: 4, overflowX: "auto"
        }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              background: "none", border: "none",
              borderBottom: tab === i ? `3px solid ${NV.blue}` : "3px solid transparent",
              color: tab === i ? NV.dark : NV.textLight,
              padding: "10px 14px", cursor: "pointer",
              fontFamily: "'Source Sans 3',system-ui,sans-serif", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s", whiteSpace: "nowrap", marginBottom: -2
            }}>{t}</button>
          ))}
        </div>
        {tab === 0 && <TakeawaysTab />}
        {tab === 1 && <ThematicClustersTab />}
        {tab === 2 && <CriticalLiteracyTab />}
        {tab === 3 && <QAExplorerTab />}
        <div style={{ padding: "20px 0 28px", borderTop: `1px solid ${NV.border}`, marginTop: 28 }}>
          <p style={{ color: NV.textLight, fontSize: 10, margin: 0, fontFamily: "'Source Sans 3',system-ui,sans-serif" }}>
            Data collected during AI literacy session, February 2025. 42 questions transcribed from post-it notes.
            12 partially legible questions were reconstructed. Analysis by Claude in collaboration with Asher.
          </p>
        </div>
      </div>
    </div>
  );
}
