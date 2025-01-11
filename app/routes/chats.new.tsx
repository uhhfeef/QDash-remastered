import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
// import { db } from "~/utils/db.server";

const chatMessages = new Map<string, Array<{message: string}>>();
const dashboards = new Map<string, {name: string, url: string}>();

export const action: ActionFunction = async ({ request }) => {
    console.log('=== ACTION TRIGGERED ===');

    const newChatId = uuidv4();
    // console.log('NEW CHAT ID:', newChatId);

    chatMessages.set(newChatId, []);
    console.log('CHAT MESSAGES:', chatMessages);

    const dashboardName = `Dashboard ${dashboards.size + 1}`
    const newChatUrl = `/chats/${newChatId}`;

    // to do: create a database with prisma sqlite 
    dashboards.set(newChatId, {
        name: dashboardName,
        url: newChatUrl
    });

    // console.log('DASHBOARDS:', dashboards); // works
    // shud open a new chat 
    return redirect(newChatUrl);
};




// Export the messages map to be used by other routes
export { chatMessages };
export { dashboards };
