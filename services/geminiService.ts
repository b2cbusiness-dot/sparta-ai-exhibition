import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Extract the base64 string (remove data:image/jpeg;base64, prefix)
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateArtworkDescription = async (file: File): Promise<{ title: string; description: string }> => {
  if (!apiKey) {
    console.warn("No API Key provided");
    return {
      title: "AI가 분석한 멋진 작품",
      description: "API 키가 설정되지 않아 자동 생성을 완료할 수 없습니다. 하지만 정말 멋진 작품이네요!"
    };
  }

  try {
    const mediaPart = await fileToGenerativePart(file);
    const isVideo = file.type.startsWith('video/');
    
    const prompt = `
      당신은 시니어 AI 아트 전시회의 큐레이터입니다. 
      사용자가 업로드한 이 ${isVideo ? '동영상' : '그림'}을 보고, 전시회에 어울리는 감성적이고 멋진 '작품 제목'과 '작품 설명'을 지어주세요.
      
      조건:
      1. 대상 독자는 40~60대입니다.
      2. 따뜻하고, 격려하며, 희망찬 어조를 사용하세요.
      3. 설명은 2~3문장으로 간결하게 작성하세요.
      4. JSON 형식으로 답변해주세요. 예: {"title": "제목", "description": "설명"}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [mediaPart, { text: prompt }]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "나만의 AI 작품",
      description: "이 작품은 작가의 소중한 추억과 AI 기술이 만나 탄생했습니다."
    };
  }
};