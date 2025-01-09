import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';

const chatMessages = new Map<string, Array<{message: string}>>();

export const action: ActionFunction = async ({ request }) => {
  const newChatId = await createNewChat();

  const formData = await request.formData();
  const message = formData.get('message') as string;

  if (message?.trim()) {
    chatMessages.set(newChatId, [{message: message}]);
  }
  return redirect(`/chats/${newChatId}`);
};

async function createNewChat() {
  // Generate a unique ID for the new chat
  const chatId = uuidv4();
  
  console.log("Creating new chat with ID:", chatId);
  
  return chatId;
}

// Export the messages map to be used by other routes
export { chatMessages };
