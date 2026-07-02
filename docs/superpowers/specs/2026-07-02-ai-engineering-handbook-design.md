# AI Engineering Handbook — Design Spec

תאריך: 2026-07-02

## מטרה

הרחבת שישה קבצי Markdown תמציתיים (`01_Foundations.md` עד `06_Architecture_and_CheatSheet.md`) לכדי אתר HTML מקצועי, בעברית מלאה (RTL), בסגנון ספר עיון (Reference Handbook) שניתן לחזור אליו לאורך שנים. לא סיכום — תוכן מלא, מוסבר, עם דוגמאות אמיתיות ותרשימים.

## ארכיטקטורה

אתר סטטי רב-עמודי, ללא build step, נפתח ישירות מקובץ (`file://`) או מ-static hosting. כל ה-assets (Font Awesome, Prism.js, גופן עברי) מאוחסנים מקומית תחת `assets/` — לא CDN — כדי להבטיח שהאתר ימשיך לעבוד גם בעוד שנים ללא תלות ברשת.

```
AI_Engineering_Handbook_Parts/
├── index.html                        שער + תוכן עניינים מלא
├── chapters/
│   ├── 01-foundations.html
│   ├── 02-llm-apis-prompts.html
│   ├── 03-memory-rag.html
│   ├── 04-advanced-rag.html          חדש
│   ├── 05-agents.html
│   ├── 06-agent-patterns.html        חדש
│   ├── 07-evaluation.html            חדש
│   ├── 08-production.html
│   └── 09-architecture-cheatsheet.html
├── assets/
│   ├── style.css
│   ├── script.js
│   ├── fonts/                        Heebo/Assistant, מקומי
│   ├── fontawesome/                  css + webfonts, מקומי
│   └── prism/                        prism.js + prism.css, מקומי
└── 01_Foundations.md ... 06_Architecture_and_CheatSheet.md   (מקור, נשמר ללא שינוי)
```

9 פרקים: 6 מקוריים + 3 חדשים (RAG מתקדם, Agent Patterns מתקדמים, Evaluation & Testing), ממוקמים לפי זרימת למידה טבעית — כל נושא מתקדם מיד אחרי הבסיס שלו, ו-Evaluation לפני Production (בודקים לפני שמעלים).

## מערכת עיצוב

**צבעים**: רקע `#0F172A`, כרטיסים `#1E293B`, Accent `#3B82F6`, ירוק `#22C55E` (הצלחה / best practice), כתום `#F59E0B` (אזהרה / insight), אדום `#EF4444` (שגיאה / common mistake). Dark mode בלבד, ללא toggle.

**גופן**: Heebo או Assistant (Google Fonts), מורד ומאוחסן מקומית תחת `assets/fonts/`.

**Layout**:
- Sidebar קבוע בצד ימין (RTL) — רשימת 9 הפרקים, אייקון Font Awesome לכל פרק, מצב "פעיל" לפרק נוכחי.
- בתוך כל עמוד פרק: TOC משני (מיני) בצד שמאל עם Scroll Spy שמדגיש את הסעיף הנראה.
- Header עליון sticky עם breadcrumb.
- כפתור "חזרה למעלה" מופיע בגלילה.
- אייקונים מ-Font Awesome (מקומי) בכל כותרת פרק ובכל callout box.

**איקונוגרפיה סמנטית לכל תת-נושא**: מה זה (info), למה צריך (question), איך זה עובד (cogs), דוגמה (lightbulb/flask), Flow Diagram (project-diagram), Best Practices (check-circle, ירוק), Common Mistakes (times-circle, אדום, ניתן לקיפול), AI Engineer Insight (💡, כתום), מה חשוב לזכור (list-check).

## תבנית קבועה לכל נושא

כל נושא בתוך כל פרק בנוי מהסעיפים הבאים, לפי הסדר, ללא דילוג:

1. **כותרת** + אייקון
2. **מה זה?** — הגדרה ברורה וקצרה
3. **למה צריך את זה?** — מתי משתמשים ולמה זה חשוב
4. **איך זה עובד?** — הסבר מדויק, לא שטחי
5. **דוגמה** — מקרה אמיתי (ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Perplexity, ו-After Taste כשרלוונטי — פרויקט Supabase+React של המשתמש)
6. **תרשים Flow** — דיאגרמת קופסאות-וחצים בנויה HTML/CSS (לא תמונה), RTL, עם הסבר קצר בעברית ליד כל רכיב
7. **Best Practices** — רשימה ירוקה
8. **Common Mistakes** — רשימה אדומה, קופסה ניתנת לקיפול (`<details>`)
9. **💡 AI Engineer Insight** — קופסה כתומה, נקודת מחשבה מקצועית לא טריוויאלית
10. **מה חשוב לזכור** — 4–8 בולטים קצרים בסיום הנושא

התבנית קבועה אך לא מכנית: נושאים קטנים (כמו Temperature) מקבלים גרסה קומפקטית של אותם סעיפים — כל סעיף עדיין מופיע, אך במשפט או שניים, וה-Flow Diagram מושמט כשאין רצף שלבים משמעותי; נושאים גדולים (כמו RAG) מקבלים טיפול מלא בכל סעיף. המטרה היא ספר עיון צפוף ומדויק, לא הגדלת מספר העמודים — ללא כפילויות בין פרקים (הפניה לפרק אחר במקום הסבר חוזר).

כל פרק (למעט פרק 9) מסתיים בסעיף **Real World Example** נפרד מהתבנית של 10 החלקים — הדגמה קצרה וממוקדת של מוצר אמיתי (ChatGPT/Claude/Gemini/Cursor/GitHub Copilot/Perplexity/After Taste) שמיישם כמה ממושגי הפרק יחד.

**נושאים נוספים שזוהו כחסרים והוספו**: Context Compression / Long Context (פרק 1), Guardrails ו-Output Validation ברמת מדיניות/בטיחות (פרק 8, בנוסף ל-Validation של תקינות JSON בפרק 2), Model Selection — קריטריונים עמידים בזמן לבחירת מודל (פרק 9, לצד טבלת ההשוואה).

## תוכן לפי פרק

### 1. יסודות (Foundations)
AI/ML/Deep Learning/LLM (היררכיה), LLM = חיזוי Token הבא, Tokenization ומחיר/Latency, Context Window (מרכיבים), Temperature/Top-P/Max Tokens, Streaming, Inference, Hallucinations וצמצומן. תוספת: Pretraining בקצרה, Multimodality כהקדמה (מפורט בפרק Agents).

### 2. LLM APIs ו-Prompt Engineering
זרימת API (Frontend→Backend→Prompt Builder→LLM API→Validation→Frontend), System/User/Assistant roles, נוסחת Prompt טוב (Role+Task+Constraints+Context), Context Engineering, Few-Shot/Zero-Shot/Chain-of-Thought, Structured Output (JSON mode, function-calling schemas, Pydantic/Zod), Validation (למה לא לסמוך על LLM ישירות), Prompt Chaining.

### 3. Memory & RAG (בסיס)
Conversation Memory, RAG Flow (Question→Embedding→Vector Search→Documents→LLM), Memory Manager, Token Budgeting, Embeddings, Vector DB — מושגי יסוד, Cosine Similarity, כלל ההכרעה RAG מול Fine-Tuning.

### 4. RAG מתקדם — חדש
אסטרטגיות Chunking (fixed/recursive/semantic), Hybrid Search (BM25+Vector), Reranking (cross-encoders), השוואת Vector DBs (Pinecone/Weaviate/pgvector/Chroma), שיפור שאילתות (HyDE, Multi-Query), הקדמה ל-Agentic RAG (מפנה לפרק 6), הקדמה להערכת RAG (מפנה לפרק 7).

### 5. Agents & Modern AI (בסיס)
Function Calling, Tool Calling, Agent loop (User→Planner→Tools→LLM→Response), Multi-Agents — הקדמה, MCP, Vision (Image→Vision→Context→LLM), Reasoning Models (extended thinking / o-series).

### 6. Agent Patterns מתקדמים — חדש
ReAct, Plan-and-Execute, Reflexion/self-critique, דפוסי תזמור multi-agent (Supervisor, Swarm), Human-in-the-loop, טיפול בשגיאות ו-retries בלולאת agent, זיכרון agent (short/long/episodic).

### 7. Evaluation & Testing — חדש
למה evals קריטיים, LLM-as-judge, Benchmarks, A/B testing בפרודקשן, Golden datasets, Regression testing לפרומפטים, CI/CD לפיצ'רי AI, מדדי הערכה ל-RAG (faithfulness/relevance).

### 8. Production AI
Security & Prompt Injection, Logging, Monitoring & Observability, AI Gateway, Fallback, Cache (כולל semantic cache), Latency, Cost Optimization, Model Routing, Rate Limiting.

### 9. Architecture & Cheat Sheet
תרשים ארכיטקטורה מלא מקצה לקצה, Checklist לפני כל בקשה, Glossary מורחב, טבלת-עזר קומפקטית להשוואת מודלים נפוצים (כחלק מה-cheat sheet, לא פרק נפרד).

## היבטים טכניים

- **HTML**: סמנטי, נגיש (`<details>`, `aria-*` בסיסי), ללא Bootstrap.
- **CSS**: מודרני (Grid/Flexbox/Custom Properties), קובץ משותף אחד `assets/style.css`.
- **JS**: מינימלי, קובץ משותף `assets/script.js` — Sidebar toggle, Scroll Spy, Back-to-Top, קיפול Common Mistakes.
- **Syntax Highlighting**: Prism.js מקומי, לבלוקי קוד (JSON schemas, prompt templates, קטעי Python/TS).
- **הדפסה**: `@media print` ייעודי — מנטרל Sidebar/Nav, הופך לרקע בהיר/טקסט כהה, פורס כל פרק כעמוד נקי.
- **קבצי המקור** (`01_Foundations.md` וכו') נשארים כפי שהם בתיקייה — משמשים כבסיס ידע, לא נמחקים ולא נערכים.

## סגנון כתיבה

עברית מקצועית, רציפה, ללא "בוא נלמד" / "חשוב להבין" / "אני אסביר". טקסט עיוני שנכתב פעם אחת ונשאר נכון. אין קיצור לצורך חיסכון במקום; אין חזרות מיותרות בין פרקים (הפניה לפרק אחר במקום שכפול).

## אסטרטגיית בנייה (להמשך ל-writing-plans)

בשל היקף התוכן (9 פרקים עשירים), הבנייה תתבצע בשלבים: (1) שלד משותף — `index.html`, `assets/style.css`, `assets/script.js`, והורדת assets מקומיים; (2) כתיבת כל פרק בנפרד לפי התבנית הקבועה, ניתנת להאצלה מקבילית ל-subagents כשהשלד וה-style guide קיימים; (3) בדיקת ניווט/scroll-spy/הדפסה מקצה לקצה.
