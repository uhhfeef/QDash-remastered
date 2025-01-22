
import { ChatInput } from "../components/chat-input";
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createChatItem, getAllChatItems, storeChatMessages } from "~/utils/db.server";
import { FormEvent } from "react";
import { getChatResponse } from "~/utils/openai.server";

export const action: ActionFunction = async ({ request }) => {
  // console.log('=== LOAD NEW CHAT ACTION TRIGGERED ===');
  const newChatId = uuidv4();
  console.log('NEW CHAT ID:', newChatId);

  const chats = await getAllChatItems();
  // console.log('chats:', chats);

  const chatName = `Chat ${chats.length + 1}`
  const newChatUrl = `/chats/${newChatId}`;

  await createChatItem({ name: chatName, url: newChatUrl, chatId: newChatId });

  const formData = await request.formData();
  const message = formData.get('message') as string;

  if (message?.trim()) {
    // Create new chat and its first message
    console.log('message in action in /new:', message);
    await storeChatMessages(message, 'user', newChatId);
    // console.log(chatMessages);
    const completion = await getChatResponse(newChatId); 
    // console.log('AI RESPONSE:', completion);
    
    await storeChatMessages(completion?.choices[0].message.content as string, 'assistant', newChatId);
  }



  return redirect(`/chats/${newChatId}`);
};

export default function New() {

  // TO DO: cleanup
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // console.log("Message submitted:", message);
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    if(message?.trim()) {
        // console.log("Message submitted:", message);
        // setMessages(prev => [...prev, { role: 'user', content: message }]);
        // console.log('set messages:', message);
        // console.log('AI RESPONSE:', aiResponse);

        // Submit to action to get AI response
        // fetcher.submit(formData, { method: "post" });
    }

    e.currentTarget.reset();

  };

    return (
      <div className="absolute inset-0 flex flex-col min-h-full items-center justify-center max-w-[40rem] mx-auto gap-4">
        <div className="text-6xl text-gray-800 font-semibold items-center mb-6">
          <h1>Create a dashboard</h1>
        </div>
        
        <div className="flex flex-col w-full gap-5">
          <div className="relative flex items-center">
            <ChatInput placeholder="Create a line chart on..."  />
          </div>
        </div>

        <div className="flex py-4 text-xs gap-3 justify-between">
          <p className="border px-2 bg-gray-50 rounded-full">Show top 10 customers</p>
          <p className="border px-2 bg-gray-50 rounded-full">Calculate monthly revenue</p>
          <p className="border px-2 bg-gray-50 rounded-full">Group sales by region</p>
        </div>
      </div>
    );
  }