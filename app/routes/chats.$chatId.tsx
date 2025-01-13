import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams, useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import Split from "react-split";
import { ChatInput } from "~/components/chat-input";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { db } from "~/utils/db.server";
import { getChatResponse, type Message } from "~/utils/openai.server";
import { chatMessages } from "./chats.new";
// export const loader: LoaderFunction = async ({ params }) => {

//     // return json({ messages: chat.messages });
//     return json({  });
// };

// interface Message {
//     role: string;
//     content: string;
// }

interface ActionData {
    messages: Message[];
}

export const loader: LoaderFunction = async ({ params }) => {
    const chatId = params.chatId as string;
    const messages = chatMessages.get(chatId) || [];
    // console.log('LOADER MESSAGES:', messages);
    return json({ messages });
};

export const action: ActionFunction = async ({ request, params }) => {
    // to send chatgpt request since its a server only module
    const formData = await request.formData();
    const message = formData.get("message") as string;

    // TO DO: needs to handle chat history
    const aiResponse = await getChatResponse([{ role: 'user', content: message }]); 
    console.log('AI RESPONSE:', aiResponse);

    return json({ messages: [{ role: 'assistant', content: aiResponse }] });
};



export default function Chats() {
    const { messages: initialMessages } = useLoaderData<{ messages: Message[] }>();
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const fetcher = useFetcher<ActionData>();
    const { chatId } = useParams();

    // Reset messages when chatId changes
    useEffect(() => {
        setMessages(initialMessages);
    }, [chatId]);

    // Update messages when the fetcher data changes
    useEffect(() => {
        const data = fetcher.data;
        if (data && 'messages' in data) {
            setMessages(prev => [...prev, data.messages[0]]);
        }
    }, [fetcher.data]);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("Message submitted:", message);
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;
        if(message?.trim()) {
            // console.log("Message submitted:", message);
            setMessages(prev => [...prev, { role: 'user', content: message }]);
            console.log('set messages:', messages);
            // console.log('AI RESPONSE:', aiResponse);

            // Submit to action to get AI response
            fetcher.submit(formData, { method: "post" });
        }

        e.currentTarget.reset();

    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <Split 
                className="flex flex-grow"
                sizes={[70, 30]}
                minSize={300}
                expandToMin={false}
                gutterSize={4}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                <div className="h-full flex flex-col">
                    <div className="flex-grow overflow-auto max-w-3xl w-full mx-auto p-4 overflow-y-auto">
                    {messages.map((message, index) => (
                            <div className="flex py-3 gap-2" key={index}>
                                <Avatar className="h-8 w-8">
                                {message.role === 'user' ? (
                                    <AvatarFallback>U</AvatarFallback>
                                ) : (
                                    <AvatarFallback>AI</AvatarFallback>
                                )}
                                </Avatar>
                                <div className="px-4 rounded-lg max-w-[80%]">
                                    <p className="text-sm text-gray-900">{message.content}</p>
                                </div>
                            </div>
                        ),
                    )}
                    </div>
                    <div className="w-full px-4 pb-4 flex-shrink-0">
                        <ChatInput onSubmit={handleSubmit}/>
                        <div className="flex items-center justify-center pt-2 text-xs text-gray-500">
                            QDash may make mistakes. Please use with discretion.
                        </div>
                    </div>
                </div>
                <div className="h-full overflow-auto">
                    {/* Right pane content */}
                </div>
            </Split>
        </div>
    );
}