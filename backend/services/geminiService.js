import { GoogleGenAI } from "@google/genai";

let client = null;

const getClient = () => {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

const MODEL = "gemini-3.5-flash-lite";

// Strips markdown code fences that Gemini sometimes wraps JSON in
const cleanJson = (text) => {
  if (!text) return text;
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
};

const callGemini = async (systemInstruction, userPrompt) => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  const text = response?.text;

  if (!text) {
    throw new Error("Received an empty response from the AI. Please try again.");
  }

  return text;
};

export const generateTutorResponse = async ({ subject, level, question }) => {
  const systemInstruction = `You are AI Study Buddy, a friendly and patient AI tutor for college students.
Explain concepts in simple, clear language appropriate for a "${level}" level student.
Use short paragraphs, give a concrete example, and highlight the most important points.
Avoid unnecessary jargon and complexity. Keep the tone encouraging.
Do not answer questions unrelated to academic learning.`;

  const userPrompt = `Subject: ${subject}
Student level: ${level}
Question: ${question}

Please explain this clearly, with an example, for a ${level} student.`;

  return callGemini(systemInstruction, userPrompt);
};

export const generateQuiz = async ({ subject, topic, difficulty, numQuestions }) => {
  const systemInstruction = `You are a quiz generator for a college learning app.
Generate multiple-choice quiz questions and respond ONLY with valid JSON, no markdown, no commentary.
JSON shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctAnswer": "string (must exactly match one of the options)",
      "explanation": "string"
    }
  ]
}`;

  const userPrompt = `Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${numQuestions}

Generate exactly ${numQuestions} multiple-choice questions with 4 options each.`;

  const raw = await callGemini(systemInstruction, userPrompt);
  const parsed = JSON.parse(cleanJson(raw));
  return parsed.questions || [];
};

export const generateStudyPlan = async ({ subjects, examDate, dailyHours, level }) => {
  const systemInstruction = `You are an academic study planner for a college learning app.
Generate a realistic, day-by-day study schedule and respond ONLY with valid JSON, no markdown, no commentary.
JSON shape:
{
  "days": [
    {
      "day": 1,
      "subject": "string",
      "topic": "string",
      "duration": "string",
      "activity": "string"
    }
  ]
}
Include periodic revision and test/practice days. Keep the plan realistic given the daily study hours available.`;

  const userPrompt = `Subjects: ${subjects.join(", ")}
Exam date: ${examDate}
Daily study hours: ${dailyHours}
Current level: ${level}

Generate a day-by-day study plan from today until the exam date.`;

  const raw = await callGemini(systemInstruction, userPrompt);
  const parsed = JSON.parse(cleanJson(raw));
  return parsed.days || [];
};

export const generateRecommendation = async ({ weakTopics, overallStats }) => {
  const systemInstruction = `You are AI Study Buddy's recommendation engine for a college learning app.
Based on the student's quiz performance, provide focused, encouraging, purely educational study advice.
Respond ONLY with valid JSON, no markdown, no commentary.
JSON shape:
{
  "summary": "string - short encouraging summary of performance",
  "topicsToRevise": ["string"],
  "recommendedOrder": ["string"],
  "practiceSuggestions": ["string"],
  "recommendedQuizTopic": "string"
}
Do not give medical, financial, political, or any non-educational advice.`;

  const userPrompt = `Overall stats: ${JSON.stringify(overallStats)}
Weak topics (topic: percentage score): ${JSON.stringify(weakTopics)}

Generate a personalized study recommendation.`;

  const raw = await callGemini(systemInstruction, userPrompt);
  return JSON.parse(cleanJson(raw));
};
