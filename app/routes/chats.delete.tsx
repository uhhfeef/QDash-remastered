import { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteChatItem } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const chatId = formData.get("chatId") as string;
    console.log('Chat ID:', chatId); 
    // delete chat from database
    await deleteChatItem(chatId);
    // delete chat from map
    // chatMessages.delete(chatId);    
    return redirect("/");
};