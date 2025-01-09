import { Form, useParams } from "@remix-run/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Paperclip, ArrowUp } from "lucide-react";

interface ChatInputProps {
    placeholder?: string;
    onSubmit?: (e: React.FormEvent) => void;
}
  
export function ChatInput({ placeholder = "Type a message...", onSubmit }: ChatInputProps) {
  const params = useParams();
  const chatId = params.chatId;

  const action = chatId 
    ? `/chats/${chatId}` 
    : `/chats/new`;

  return (
      <Form className="max-w-3xl w-full mx-auto" method="post" action={action}  onSubmit={onSubmit}>
      <div className="relative">
          <Input 
          name="message"
          className="rounded-2xl py-6 pr-24 pb-16 text-base shadow-sm border border-gray-300 focus-visible:ring-gray-200" 
          placeholder={placeholder}
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
      );
    }
    