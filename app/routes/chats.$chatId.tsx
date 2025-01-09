import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Paperclip, ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { chatMessages } from "./chats.new";
import type { LoaderFunction } from "@remix-run/node";
import { ChatInput } from "~/components/chat-input";

export const loader: LoaderFunction = async ({ params }) => {
    const chatId = params.chatId;  
    if (!chatId) {
        throw new Error("Chat ID is required");
    }
    const messages = chatMessages.get(chatId) || [];
    return json({ messages });
  }

export default function Chats() {
    const { messages: initialMessages } = useLoaderData<{ messages: Array<{message: string}> }>();
    const [messages, setMessages] = useState(initialMessages);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("Message submitted:", message);
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;
        if(message?.trim()) {
            console.log("Message submitted:", message);
            setMessages(prev => [...prev, {message}]);
            (e.target as HTMLFormElement).reset();
        }
        console.log(messages);
    };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-grow mx-auto w-full max-w-3xl">
        { messages.map((msg, index) => (
            <div key={index} className="space-y-4">
            <div className="p-4 max-w-[80%] flex justify-start ">
            <p className="text-sm text-gray-900">{msg.message}</p>    
            </div>
            </div>
        ))}
      </div>
      <div className="w-full px-4 pb-4">
        <ChatInput onSubmit={handleSubmit} />
        <div className="flex items-center justify-center pt-2 text-xs text-gray-500">QDash may make mistakes. Please use with discretion.</div>
      </div>
    </div>
  );
}