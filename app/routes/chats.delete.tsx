import { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteChatItem } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const id = formData.get("id") as string;


    console.log('Chat ID:', id); 
    // delete chat from database
    await deleteChatItem(id);
    // await deleteChatItem(chatId);

    // delete chat from map
    // chatMessages.delete(chatId);    
    return redirect("/");
};