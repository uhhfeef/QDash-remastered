import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
    message: string;
}

export async function getChatResponse(userMessage: string, existingMessages: Message[] = []) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant. Let's think step by step. If the user just wants to have a natural conversation, you should not use the sql tool. You don't need to explain what you're going to do before using the SQL tool. You can use the sql tool to fetch data from the database. You can also use the chart tool to create charts. For pie chart, values would be in x and labels for the values in y. Even though you can execute SQL queries using the sql tool, you dont have access to the data output from the sql tool. If you need to convert data from one chart type to another, you dont need to call the sql tool again and again to fetch the same data. You must always call only 1 function at a time, tool_calls must always be a 1 array. You will NEVER GENERATE RANDOM X AND Y VALUES for the chart tool. You will always double check and think step by step before you call the chart tool. NEVER EVER INSERT OR DELETE FROM THE TABLE" },
                ...existingMessages.map(msg => ({ 
                    role: "user" as const, 
                    content: msg.message 
                })),
                { role: "user", content: userMessage }
            ],
            model: "gpt-4o-mini",
        });

        const aiResponse = completion.choices[0]?.message?.content;
        if (!aiResponse) {
            throw new Error("No response from AI");
        }

        // For first message (no existing messages)
        if (existingMessages.length === 0) {
            return {
                aiResponse,
                updatedMessages: [
                    { message: userMessage },
                    { message: aiResponse }
                ]
            };
        }

        // for the rest
        return {
            aiResponse,
            updatedMessages: [
                ...existingMessages,
                { message: aiResponse }
            ]
        };
        


    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}