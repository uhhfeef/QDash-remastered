import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
    role: string;
    content: string;
}

export async function getChatResponse(messages: Message[]) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant."},
                ...messages.map(msg => ({ 
                    role:  msg.role as "user" | "assistant" ,
                    content: msg.content 
                })),
            ],
            model: "gpt-4o-mini",
        });
        return completion.choices[0].message?.content;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return null;
    }
}
  