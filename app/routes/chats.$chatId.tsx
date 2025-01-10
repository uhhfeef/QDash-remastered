import { json, type ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams, useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { chatMessages } from "./chats.new";
import type { LoaderFunction } from "@remix-run/node";
import { ChatInput } from "~/components/chat-input";
import { openai, getChatResponse } from '~/utils/openai.server';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface Message {
    message: string;
}

interface ActionData {
    messages: Message[];
    error?: string;
}


export const loader: LoaderFunction = async ({ params }) => {
    const chatId = params.chatId;  
    if (!chatId) {
        throw new Error("Chat ID is required");
    }
    const messages = chatMessages.get(chatId) || []; // getting the first message from chats.new.tsx
    // console.log('loader',messages);

    const firstMessage = messages[0].message;
    const {updatedMessages} = await getChatResponse(firstMessage);
    chatMessages.set(chatId, updatedMessages); // appends to existing messages
    // console.log('loader',updatedMessages);

    return json({ messages: updatedMessages });
}

export const action: ActionFunction = async ({ request, params }) => {
    // to send chatgpt request
    const formData = await request.formData();
    const message = formData.get("message") as string;
    console.log('MESSSAGE:', message);
    const chatId = params.chatId as string;  
    
    const existingMessages = chatMessages.get(chatId) || [];
    console.log('EXISTING MESSAGES:', existingMessages);
    const newMessages = [...existingMessages, { message }];
    console.log('NEW MESSAGES:', newMessages);

    const {updatedMessages} = await getChatResponse(message, newMessages);
    chatMessages.set(chatId, updatedMessages);
    
    console.log('UPDATED MESSAGES:',updatedMessages);
    
    return json({ messages: updatedMessages });

};

export default function Chats() {
    const { messages: initialMessages } = useLoaderData<{ messages: Array<{message: string}> }>();
    const [messages, setMessages] = useState(initialMessages);
    const fetcher = useFetcher<ActionData>();
    useEffect(() => {
        if (fetcher.data?.messages) {
            setMessages(fetcher.data.messages);
        }
    }, [fetcher.data?.messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("Message submitted:", message);
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;
        if(message?.trim()) {
            console.log("Message submitted:", message);
            setMessages(prev => [...prev, {message}]);
            console.log('after set messages', messages);

            // Submit to action to get AI response
            fetcher.submit(formData, { method: "post" });

            (e.target as HTMLFormElement).reset();
        }
        // console.log(messages);
   
        // message > send it to chatgpt api > await results > setMessages > render > scroll to bottom > clear input 
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-grow flex-col mx-auto w-full max-w-3xl">
                <div className="flex flex-col space-y-4 p-4">
                    { messages.map((msg, index) => (
                        <div key={index} className="flex  gap-2">
                            <Avatar className="h-8 w-8 rounded-lg justify-center flex-shrink-0">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>Q</AvatarFallback>
                            </Avatar>   
                            <div className="px-4 rounded-lg max-w-[80%]">
                                <p className="text-sm text-gray-900">{msg.message}</p>    
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        <div className="w-full px-4 pb-4">
            <ChatInput onSubmit={handleSubmit} />
            <div className="flex items-center justify-center pt-2 text-xs text-gray-500">QDash may make mistakes. Please use with discretion.</div>
        </div>
        </div>
    );
}