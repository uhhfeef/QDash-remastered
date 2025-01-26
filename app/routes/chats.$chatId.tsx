import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams, useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import Split from "react-split";
import { ChatInput } from "~/components/chat-input";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getChatResponse, type Message } from "~/utils/openai.server";
// import { chatMessages } from "./chats.new";
import { getChatHistory, getChatMessages, storeChatHistory, storeChatMessages, storeChatTools } from "~/utils/db.server";
import { Completions } from "openai/resources/completions.mjs";
import { handleToolCall } from "~/utils/handleToolCall";
import { useDuckDB } from "~/services/duckDbConfig";
import { ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from "openai/resources/index.mjs";
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

interface ActionResponse {
    messages?: Message[];
    tool_calls?: ChatCompletionMessageToolCall[];
    code?: string;
}

export const loader: LoaderFunction = async ({ params }) => {
    const chatId = params.chatId as string;
    const messages = await getChatMessages(chatId) || [];
    // console.log('LOADER MESSAGES:', messages);
    return json({ messages });
};

export const action: ActionFunction = async ({ request, params }) => {
    // to send chatgpt request since its a server only module
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const tools = formData.get("tools") as string;
    const toolResult = formData.get("toolResult") as string;
    const chatId = params.chatId as string;
    let aiResponse = null;

    const handleAIResponse = async (aiResponse: any) => {
        if (aiResponse?.content?.includes("<shadcn>")) {
            const startTag = "<shadcn>";
            const endTag = "</shadcn>";
            const artifactCode = aiResponse.content.replace(startTag, "").replace(endTag, "").replace("```", "").replace("javascript", "");
            // console.log('AI RESPONSE:', JSON.stringify(aiResponse.content));
            return ({code: artifactCode})
        }

        if (aiResponse?.tool_calls) {
            await storeChatHistory(aiResponse, chatId);
            return json({ tool_calls: aiResponse.tool_calls });
        }

        if (aiResponse?.content) {
            await storeChatMessages(aiResponse?.content as string, 'assistant', chatId);
            await storeChatHistory({ role: 'assistant', content: aiResponse?.content }, chatId);
            return json({ messages: [{ role: 'assistant', content: aiResponse?.content }] });
        }
    }

    if (message?.trim()) {
        await storeChatMessages(message, 'user', chatId);
        await storeChatHistory({ role: 'user', content: message }, chatId);
        // console.log('params.chatId:', params.chatId);
        
        const MAX_ITERATIONS = 3;

        const completion = await getChatResponse( chatId);

        aiResponse = completion?.choices[0].message;
        // console.log('AI RESPONSE:', aiResponse);

        return handleAIResponse(aiResponse);
        // try {
        //     console.group('Chat Processing');
        //     while (iterationCount < MAX_ITERATIONS) {
        //         iterationCount++;
        //         console.log('%c Iteration ' + iterationCount + ' of ' + MAX_ITERATIONS, 'background: #333; color: #00ff00; padding: 2px 6px; border-radius: 2px;');
    
        //         console.log('%c Sending chat request to LLM...', 'color: #0066ff; font-weight: bold;');
        //         // const data = await sendChatRequest(messages, tools);

                
        //         const completion = await getChatResponse( chatId); 

                
        //         // console.log('%c Received response with trace_id:', 'color: #0066ff; font-weight: bold;', data.trace_id);
    
        //         // const message = data.choices[0].message;
                
        //         // messages.push(message);
        //         // chatManager.addMessage(message);
        //         aiResponse = completion?.choices[0].message;
        //         console.log('%c Received message:', 'color: #ff6600; font-weight: bold;', aiResponse);

        //         // if there is content, return json with messages
        //         if (aiResponse?.content) {
        //             return json({ messages: [{ role: 'assistant', content: aiResponse.content }] });
        //         }
        //         await storeChatMessages(aiResponse?.content as string, 'assistant', params.chatId as string);
        //         await storeChatHistory(aiResponse, chatId);
    

    
        //         // console.log('%c Received message:', 'color: #ff6600; font-weight: bold;', message);
    
        //         // if (message.content) {
        //         //     addMessageToChat(message.content, 'assistant', data.trace_id);
        //         //     // if (message.content.includes('DONE')) break;
        //         // }
                
        //         if (aiResponse?.tool_calls) {
        //             return json({ messages: [{ role: 'tool_calls', content: aiResponse }] });
        //             for (const toolCall of aiResponse.tool_calls) {
        //                 // console.log('here')
        //                 const { db, conn} = useDuckDB();
        //                 const toolResult = await handleToolCall(toolCall, db, conn);
        //                 await storeChatMessages(toolResult.content as string, 'tool', params.chatId as string);
        //                 await storeChatHistory(toolResult, chatId);
        //             }
        //         } else {
        //             break; // TO DO: double chk why it stops the conversation here
        //         }

        //     }
        //     console.groupEnd();
    
        //     if (iterationCount >= MAX_ITERATIONS) {
        //         // addMessageToChat("Reached maximum number of iterations. Stopping here.", 'assistant');
        //         console.log("Reached maximum number of iterations. Stopping here.", 'assistant');
        //     }

        //     // returns in fetcher
        //     return json({ messages: [{ role: 'assistant', content: aiResponse?.content }] });

    
        // } catch (error) {
        //     console.error('Error:', error);
        //     // addMessageToChat('Sorry, there was an error processing your request.', 'assistant');
        //     console.log('Sorry, there was an error processing your request.', 'assistant');
        // }
    }

    // if tools were created after file upload
    if (tools) {
        // works!
        const tools = formData.get("tools") as string;
        const chatId = formData.get("chatId") as string;
        await storeChatTools(tools, chatId);
        return json({ tools });    
    }

    if (toolResult) {
        const toolResultParsed = JSON.parse(toolResult);
        await storeChatHistory(toolResultParsed, chatId);

        const completion = await getChatResponse(chatId); 
        const aiResponse = completion?.choices[0].message;
        return handleAIResponse(aiResponse);
    }
    return null;
};



export default function Chats() {
    const { messages: initialMessages } = useLoaderData<{ messages: Message[] }>();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [code, setCode] = useState<string>("");
    const fetcher = useFetcher<ActionResponse>();
    const { chatId } = useParams();
    const { db, conn} = useDuckDB();

    // Reset messages when chatId changes
    useEffect(() => {
        setMessages(initialMessages);
    }, [chatId]);

    useEffect(() => {
        const data = fetcher.data as ActionResponse | undefined;
        
        if (data?.messages) {
            console.log('in')
            const validatedMessages = data.messages;
            setMessages(prev => [...prev, validatedMessages[0]]);
            // setShouldContinue(false); // Stop the loop
        }
        else if (data?.tool_calls) {
            (async () => {
                for (const toolCall of data.tool_calls!) {
                    const toolResult = await handleToolCall(toolCall, db, conn);
                    const formData = new FormData();
                    formData.append("toolResult", JSON.stringify(toolResult));
                    fetcher.submit(formData, { method: "post" });
                }
            })();
        } else if (data?.code) {
            setCode(data.code);
        }
    }, [fetcher.data]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;
        
        if(message?.trim()) {
            setMessages(prev => [...prev, { role: 'user', content: message }]);
            fetcher.submit(formData, { method: "post" });
        }
        e.currentTarget.reset();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
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
                    {/* Add this later:
                                    Build visuals with your data
                Select or drag fields from the Data pane onto the report canvas. */}
                    <div className="h-full w-full p-4 overflow-y-auto">
                        <iframe src="/iframeContent" sandbox="allow-scripts allow-same-origin" className="w-full h-full" />
                    </div>
                </div>
            </Split>
        </div>
    );
}