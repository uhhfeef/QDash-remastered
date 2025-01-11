import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
import { db } from "~/utils/db.server";

const chatMessages = new Map<string, Array<{message: string}>>();
const dashboard = new Map<string, {name: string, url: string}>();

export const action: ActionFunction = async ({ request }) => {
    const newChatId = uuidv4();

    dashboard.set(newChatId, {
        name: `Chat ${newChatId.slice(0, 8)}`,
        url: `/chats/${newChatId}`,
    });

    const formData = await request.formData();
    const message = formData.get('message') as string;

    if (message?.trim()) {
        // Create new chat and its first message
        await db.chat.create({
            data: {
                id: newChatId,
                messages: {
                    create: {
                        content: message
                    }
                }
            }
        });
        // console.log(chatMessages);
    }
    return redirect(`/chats/${newChatId}`);
};




// Export the messages map to be used by other routes
export { chatMessages };
export { dashboard };
