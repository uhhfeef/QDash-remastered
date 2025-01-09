import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Paperclip, ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { chatMessages } from "./chats.new";
import type { LoaderFunction } from "@remix-run/node";

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
            <p>{msg.message}</p>    
            </div>
            </div>
        ))}
      </div>
      <div className="w-full px-4 pb-4">
        <Form className="max-w-3xl mx-auto" method="post"  onSubmit={handleSubmit}>
            <div className="relative">
                <Input 
                name="message"
                className="rounded-2xl py-6 pr-24 pb-16 text-base shadow-sm border border-gray-300 focus-visible:ring-gray-200" 
                placeholder="Ask a follow up..."
                // value={inputValue}
                // onChange={(e) => setInputValue(e.target.value)}
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between ">
                    <Button size="icon" variant="ghost" className="border p-3 hover:bg-gray-100 rounded-xl">
                        <Paperclip className="rounded-md h-8 w-8 text-gray-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="bg-gray-100 hover:bg-black text-gray-600 hover:text-white p-3 rounded-full">
                        <ArrowUp className=" h-8 w-8" />
                    </Button>
                </div>
            </div>
        </Form>
      </div>
    </div>
  );
}