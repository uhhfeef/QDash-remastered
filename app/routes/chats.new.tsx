import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';

export const action: ActionFunction = async ({ request }) => {
  const newChatId = await createNewChat();
  return redirect(`/new`);
};

async function createNewChat() {
  // Generate a unique ID for the new chat
  const chatId = uuidv4();
  
  // Here you would typically save the chat to your database
  // For now, we'll just return the ID
  console.log("Creating new chat with ID:", chatId);
  
  return chatId;
}