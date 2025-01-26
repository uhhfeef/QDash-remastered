import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
import { json } from "@remix-run/node";
import { createChatItem, getAllChatItems } from "~/utils/db.server";
import { ChatInput } from "~/components/chat-input";
// import { db } from "~/utils/db.server";

// const chatMessages = new Map<string, Array<{message: string}>>();
const dashboards = new Map<string, {name: string, url: string}>();

// export const loader: LoaderFunction = async () => {
//     console.log('=== LOADER TRIGGERED ===');
//     console.log('DASHBOARDS:', dashboards);
//     return json({
//         dashboards: Array.from(dashboards.values())
//     });
// };



export const action: ActionFunction = async ({ request }) => {
    // console.log('=== ACTION TRIGGERED ===');

    const newChatId = uuidv4();
    // console.log('NEW CHAT ID:', newChatId);

    // chatMessages.set(newChatId, []);
    // console.log('CHAT MESSAGES:', chatMessages);

    // const chats = await getAllChatItems();

    // const chatName = `Chat ${chats.length + 1}`
    // const newChatUrl = `/chats/${newChatId}`;

    // to do: create a database with prisma sqlite 
    // dashboards.set(newChatId, {
    //     name: dashboardName,
    //     url: newChatUrl
    // });

    // await createChatItem({ name: chatName, url: newChatUrl, chatId: newChatId });

    // console.log('DASHBOARDS:', dashboards); // works
    // shud open a new chat 
    return redirect('/new');
};




// Export the messages map to be used by other routes
// export { chatMessages };
export { dashboards };
