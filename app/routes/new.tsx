import { useLoaderData, Form, useParams } from "@remix-run/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Paperclip, ArrowUp } from "lucide-react";

export default function New() {
    return (
      <div className="flex flex-col min-h-full items-center justify-center max-w-[40rem] mx-auto gap-4">
        <div className="text-4xl text-gray-800 font-semibold items-center mb-8">
          <h1>Create a dashboard</h1>
        </div>
        
        <div className="flex flex-col w-full gap-5">
          <div className="relative flex items-center">
            <Input 
              className="rounded-2xl py-6 pr-24 text-base shadow-sm border border-gray-300 focus-visible:ring-gray-400" 
              placeholder="Add a line chart..."
            />
            <div className="absolute right-2 flex">
              <Button size="icon" variant="ghost" className="hover:bg-gray-100 rounded-xl">
                <Paperclip className="h-8 w-8 text-gray-600" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-gray-100 rounded-xl">
                <ArrowUp className="h-8 w-8 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex text-sm gap-3 justify-between">
          <p className="border px-2 bg-gray-100 rounded-full">Generate a...</p>
          <p className="border px-2 bg-gray-100 rounded-full">Generate a...</p>
          <p className="border px-2 bg-gray-100 rounded-full">Generate a...</p>
        </div>
      </div>
    );
  }