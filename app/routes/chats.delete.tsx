import { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteSidebarItem } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const chatId = formData.get("chatId") as string;
    console.log('Chat ID:', chatId); 
    // delete chat from database
    await deleteSidebarItem(chatId);
    // delete chat from map
    // chatMessages.delete(chatId);    
    return redirect("/");
};