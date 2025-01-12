import { Form, useParams } from "@remix-run/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Paperclip, ArrowUp } from "lucide-react";
import { useState } from "react";
// import { handleFileUpload } from "~/utils/duckDbService";

interface ChatInputProps {
    placeholder?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
  
export function ChatInput({ placeholder = "Type a message...", onSubmit }: ChatInputProps) {
  const params = useParams();
  const chatId = params.chatId;

  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    // Filter for only CSV and Excel files
    const validFiles = selectedFiles.filter(file => {
      const type = file.type
      const extension = file.name.split('.').pop()?.toLowerCase()
      return type === 'text/csv' || 
             type === 'application/vnd.ms-excel' ||
             type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
             extension === 'csv' ||
             extension === 'xls' ||
             extension === 'xlsx'
    })

    setFiles(prevFiles => [...prevFiles, ...validFiles])
    
    // Log the selected files
    validFiles.forEach(file => async () => {
      console.log('Selected file:', file.name, 'Type:', file.type)
    //   fetcher = useFetcher();
        })
    }
  return (
    
      <Form className="max-w-3xl w-full mx-auto" method="post" onSubmit={onSubmit}>
        {files.length > 0 && (
          <div className="p-1 text-sm text-muted-foreground">
              {files.length} file{files.length === 1 ? '' : 's'} selected
          </div>
        )}

      <div className="relative">
          <Input 
          name="message"
          className="rounded-2xl py-6 pr-24 pb-16 text-base shadow-sm border border-gray-300 focus-visible:ring-gray-200" 
          placeholder={placeholder}
          />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between ">
              <Input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx" 
                multiple
                id="file-upload"
              />            
                <Button size="icon" variant="ghost" className="border p-3 hover:bg-gray-100 rounded-xl">
                    <label htmlFor="file-upload">
                        <Paperclip className="rounded-md h-8 w-8 text-gray-600" />
                    </label>
                </Button>
              <Button size="icon" variant="ghost" className="bg-gray-100 hover:bg-black text-gray-600 hover:text-white p-3 rounded-full" asChild>
                  <ArrowUp className=" h-8 w-8" />
              </Button>
          </div>
      </div>
  </Form>
      );
    }