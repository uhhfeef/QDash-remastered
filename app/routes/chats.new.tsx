import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
import { json } from "@remix-run/node";
import { createSidebarItem, getAllSidebarItems } from "~/utils/db.server";
// import { db } from "~/utils/db.server";

const chatMessages = new Map<string, Array<{message: string}>>();
const dashboards = new Map<string, {name: string, url: string}>();

// export const loader: LoaderFunction = async () => {
//     console.log('=== LOADER TRIGGERED ===');
//     console.log('DASHBOARDS:', dashboards);
//     return json({
//         dashboards: Array.from(dashboards.values())
//     });
// };



export const action: ActionFunction = async ({ request }) => {
    console.log('=== ACTION TRIGGERED ===');

    const newChatId = uuidv4();
    // console.log('NEW CHAT ID:', newChatId);

    chatMessages.set(newChatId, []);
    // console.log('CHAT MESSAGES:', chatMessages);

    const dashboards = await getAllSidebarItems();

    const dashboardName = `Dashboard ${dashboards.length + 1}`
    const newChatUrl = `/chats/${newChatId}`;

    // to do: create a database with prisma sqlite 
    // dashboards.set(newChatId, {
    //     name: dashboardName,
    //     url: newChatUrl
    // });

    await createSidebarItem({ name: dashboardName, url: newChatUrl });

    // console.log('DASHBOARDS:', dashboards); // works
    // shud open a new chat 
    return redirect(newChatUrl);
};




// Export the messages map to be used by other routes
export { chatMessages };
export { dashboards };
