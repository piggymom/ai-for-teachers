# Spencer Foundation — Small Research Grant Application Draft

> **Program:** Small Research Grants (up to $50,000)
> **Eligibility:** Open to individuals with doctoral/terminal degrees
> **Deadline:** Rolling (multiple annual review cycles)
> **URL:** https://www.spencer.org/grant-types/small-research-grants

---

## Project Title
**Can AI Teach Teachers? Investigating the Impact of AI-Guided Professional Development on Teacher AI Literacy**

## Principal Investigator
Asher Scott, M.Ed. (University of Helsinki)

## Duration
12 months

## Amount Requested
$48,500

---

## Research Questions

1. **Effectiveness:** Does a 7-week AI-guided professional development course produce measurable gains in teacher AI literacy, as assessed by SOLO taxonomy progression?

2. **Artifact quality:** Do teacher-created artifacts (prompt templates, lesson plan workflows, feedback rubrics) improve in quality across the course, as measured by an independent rubric?

3. **Transfer:** Do teachers who complete the course demonstrate independent AI tool use (outside the training platform) at higher rates than baseline, and do they report applying their skills in classroom practice?

4. **Feasibility:** Is a 20-minute-per-week, AI-guided format viable for sustained teacher engagement, as evidenced by completion rates and satisfaction measures?

---

## Background and Rationale

The rapid deployment of generative AI tools has created an urgent need for teacher AI literacy — the knowledge, skills, and dispositions needed to use AI effectively and responsibly in educational practice. Despite growing recognition of this need (Luckin et al., 2022; Holmes et al., 2023), the field lacks evidence on how to build teacher AI literacy at scale.

Current professional development approaches face three well-documented limitations:

First, **one-size-fits-all delivery** fails to account for the wide variation in teachers' existing knowledge, teaching contexts, and learning goals (Darling-Hammond et al., 2017). A 3rd-grade reading teacher and a high school chemistry teacher have fundamentally different AI professional development needs.

Second, **passive delivery formats** (lectures, demonstrations, video courses) produce awareness without capability. The PD literature consistently shows that active, constructive, and interactive learning experiences produce deeper understanding than passive ones (Chi & Wylie, 2014).

Third, **brief, disconnected interventions** lack the sustained duration and coherence needed for meaningful skill development. Desimone and Garet (2015) identify sustained duration as a critical feature of effective PD, yet most AI training for teachers consists of single workshops or webinars.

Intelligent tutoring systems (ITS) offer a potential solution. Meta-analyses show that ITS can produce learning gains comparable to human tutoring (d = 0.76; VanLehn, 2011), and recent advances in large language models have dramatically expanded the range of domains amenable to AI-guided instruction. However, to date, ITS research has focused almost exclusively on student learning. The application of AI-guided tutoring to teacher professional development — and specifically to teacher AI literacy — remains unexplored.

This study investigates whether an AI-guided professional development course, designed with explicit learning science foundations (SOLO taxonomy, artifact-based learning, metacognitive scaffolding), can produce meaningful gains in teacher AI literacy within a format (20 minutes/week, 7 weeks) that respects teachers' time constraints.

---

## Research Design

### Participants
25-30 K-12 teachers recruited from 2-3 New York City public schools. Recruitment will prioritize diversity in: grade level, subject area, AI experience level, and school demographics.

### Intervention
Participants will complete AI for Teachers, a 7-week AI-guided professional development course. The course uses Skippy, an AI tutor powered by Anthropic Claude, to guide teachers through a scaffolded curriculum:

- **Week 1:** Understanding AI (mental model building)
- **Week 2:** Prompt engineering (4C Framework: Context, Constraints, Command, Criteria)
- **Week 3:** Lesson planning with AI (workflow design)
- **Week 4:** Feedback and assessment (calibration strategies)
- **Week 5:** Differentiation with AI (access without reducing rigor)
- **Week 6:** Integration and ethics (personal AI policy)

Each session lasts approximately 20 minutes and produces one concrete artifact. The AI tutor uses SOLO taxonomy to assess teacher understanding in real time and adapts scaffolding accordingly, via an asynchronous conversation classifier.

### Measures

**Primary outcome — AI literacy (SOLO level):**
Assessed at Week 1 (diagnostic) and Week 6 (summative) using the platform's built-in SOLO classifier. Additionally, a random sample of 10 conversations will be independently coded by two raters to validate the automated assessment (inter-rater reliability check).

**Secondary outcome — Artifact quality:**
All teacher artifacts (7 per participant, ~175-210 total) will be scored by two independent raters using a rubric developed for this study. The rubric will assess: specificity, pedagogical soundness, AI-appropriateness, and usability. Weeks 2 and 5 artifacts will be compared to measure growth.

**Secondary outcome — Transfer and classroom use:**
Self-report surveys at 0, 30, and 60 days post-completion measuring: frequency of independent AI tool use, types of tools used, classroom applications, and self-rated confidence (10-point scale).

**Feasibility measures:**
Completion rate, time per session, session frequency, NPS score, qualitative feedback (open-ended survey items).

### Analysis
- Paired t-tests (or Wilcoxon signed-rank if non-normal) for pre/post SOLO level comparison
- Mixed-effects models for artifact quality growth across weeks
- Descriptive statistics and thematic analysis for transfer and feasibility measures
- Effect sizes (Cohen's d) for all primary comparisons

---

## Significance

This study contributes to the field in three ways:

1. **First empirical investigation** of AI-guided teacher professional development for AI literacy. The findings will inform whether ITS approaches, proven for student learning, can be effectively applied to teacher learning.

2. **Practical design knowledge.** Regardless of outcome magnitude, the study will produce detailed implementation data — completion patterns, engagement dynamics, artifact quality trajectories — that inform the design of future AI-guided PD programs.

3. **Validated measurement approach.** The automated SOLO classification system, if validated against human coding, offers a scalable approach to assessing teacher AI literacy that could be adopted by other researchers.

---

## Timeline

| Month | Activity |
|-------|----------|
| 1-2 | IRB application, rubric development, teacher recruitment |
| 3 | Pre-surveys, teacher onboarding |
| 3-4 | 7-week intervention (teachers complete at own pace within window) |
| 5 | Post-surveys, 30-day follow-up surveys |
| 6-7 | Artifact scoring, data analysis |
| 7 | 60-day follow-up surveys |
| 8-10 | Analysis, writing |
| 11-12 | Dissemination: conference submission, journal manuscript |

---

## Budget

| Category | Amount |
|----------|--------|
| PI time (0.25 FTE, 12 months) | $30,000 |
| AI API costs (tutoring + classification, 30 teachers) | $500 |
| Hosting and infrastructure | $500 |
| Teacher participation stipends ($50 x 30) | $1,500 |
| Research assistant (artifact scoring, 100 hrs @ $25) | $2,500 |
| Survey platform (Qualtrics or similar) | $500 |
| Conference travel and registration | $3,000 |
| IRB application fee | $500 |
| Publication fees (open access) | $2,000 |
| Supplies and communications | $500 |
| Indirect costs (fiscal sponsor, 15%) | $7,000 |
| **Total** | **$48,500** |

---

## Investigator Qualifications

Asher Scott holds a Master's in Education from the University of Helsinki with specialization in competency-based assessment and improvement science. He has 15+ years of classroom teaching experience in the United States and Australia, providing deep firsthand understanding of teacher professional development needs and constraints.

Relevant technical expertise: Scott designed and built the complete AI for Teachers platform, including the SOLO-based diagnostic assessment system, the asynchronous conversation classifier, and the adaptive prompt composition engine. He previously built TimeSaveAI, an AI-powered classroom observation feedback tool serving 100+ weekly active users, demonstrating the ability to design, build, and deploy AI education tools in authentic settings.

This combination of pedagogical expertise and AI system design positions Scott uniquely to investigate the intersection of intelligent tutoring systems and teacher professional development.

---

## References

Biggs, J. B., & Collis, K. F. (1982). *Evaluating the Quality of Learning: The SOLO Taxonomy.* Academic Press.

Chi, M. T., & Wylie, R. (2014). The ICAP framework: Linking cognitive engagement to active learning outcomes. *Educational Psychologist, 49*(4), 219-243.

Darling-Hammond, L., Hyler, M. E., & Gardner, M. (2017). *Effective Teacher Professional Development.* Learning Policy Institute.

Desimone, L. M., & Garet, M. S. (2015). Best practices in teachers' professional development in the United States. *Psychology, Society and Education, 7*(3), 252-263.

VanLehn, K. (2011). The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems. *Educational Psychologist, 46*(4), 197-221.
