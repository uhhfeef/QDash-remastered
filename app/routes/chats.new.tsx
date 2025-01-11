import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
// import { db } from "~/utils/db.server";

const chatMessages = new Map<string, Array<{message: string}>>();
const dashboard = new Map<string, {name: string, url: string}>();

export const action: ActionFunction = async ({ request }) => {
    console.log('=== ACTION TRIGGERED ===');

    const newChatId = uuidv4();
    console.log('NEW CHAT ID:', newChatId);

    
    return redirect(`/chats/${newChatId}`);
};




// Export the messages map to be used by other routes
export { chatMessages };
export { dashboard };
