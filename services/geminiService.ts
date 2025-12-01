import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fetchQuestions = async (): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Buatkan 25 soal pilihan ganda bahasa Inggris yang menantang dan edukatif. 
      Topik harus tercampur rata antara: Simple Present Tense, Simple Past Tense, dan Present Perfect Tense.
      Konteks kalimat harus bervariasi (sehari-hari, akademik, bisnis).
      Pastikan setiap soal memiliki satu jawaban yang benar dan penjelasan (pembahasan) yang jelas dalam Bahasa Indonesia.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The question sentence with a blank space or a question asking for the correct form.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 4 possible answers.",
            },
            correctIndex: {
              type: Type.INTEGER,
              description: "The index (0-3) of the correct answer in the options array.",
            },
            explanation: {
              type: Type.STRING,
              description: "Explanation of why the answer is correct in Indonesian.",
            },
            topic: {
              type: Type.STRING,
              description: "The tense topic of the question (Present, Past, or Present Perfect).",
            },
          },
          required: ["text", "options", "correctIndex", "explanation", "topic"],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateQuizQuestions = async (): Promise<Question[]> => {
  try {
    // Generate 25 questions in a single request
    const rawData = await fetchQuestions();
    
    // Add IDs to questions temporarily
    const questions: Question[] = rawData.map((q: any, index: number) => ({
      id: index,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      topic: q.topic,
    }));

    // Shuffle the questions so topics are mixed
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // Re-index after shuffle for clean IDs
    return questions.map((q, i) => ({...q, id: i}));

  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw new Error("Gagal membuat soal. Silakan coba lagi.");
  }
};
