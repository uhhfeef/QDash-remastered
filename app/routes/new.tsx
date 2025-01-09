
import { ChatInput } from "../components/chat-input";

export default function New() {

    return (
      <div className="absolute inset-0 flex flex-col min-h-full items-center justify-center max-w-[40rem] mx-auto gap-4">
        <div className="text-6xl text-gray-800 font-semibold items-center mb-6">
          <h1>Create a dashboard</h1>
        </div>
        
        <div className="flex flex-col w-full gap-5">
          <div className="relative flex items-center">
            <ChatInput placeholder="Create a line chart on..." />
          </div>
        </div>

        <div className="flex py-4 text-sm gap-3 justify-between">
          <p className="border px-2 bg-gray-50 rounded-full">Generate a...</p>
          <p className="border px-2 bg-gray-50 rounded-full">Generate a...</p>
          <p className="border px-2 bg-gray-50 rounded-full">Generate a...</p>
        </div>
      </div>
    );
  }