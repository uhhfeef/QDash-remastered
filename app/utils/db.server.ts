import { PrismaClient } from "@prisma/client";
import { ChatCompletionAssistantMessageParam, ChatCompletionMessage, ChatCompletionToolMessageParam, ChatCompletionUserMessageParam } from "openai/resources/chat/completions.mjs";

let prisma: PrismaClient;

declare global {
    var __db__: PrismaClient;
  }
  
  
// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };

// chat functions
export async function getAllChatItems() {
  return prisma.chat.findMany({
    // including messages was causing error
    // include: {
    //   messages: true
    // },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getAllMessages(chatId: string) {
  return prisma.message.findMany({
    where: {
      chatId: chatId
    },
    include: {
      chat: true
    }
  });
}

export async function createChatItem({ name, url, chatId }: { name: string; url: string; chatId: string }) {
  // console.log('=== CREATING chat ITEM ===');
  // console.log('NAME:', name);
  // console.log('URL:', url);
  // console.log('CREATED AT:', createdAt);
  return prisma.chat.create({
    data: {
      name,
      url,
      chatId
    },
  });
}

export async function deleteChatItem(id: string) {
  console.log('=== DELETING chat ITEM ===');
  console.log('ID:', id);
  
  // Get the chat first to find its chatId
  const chat = await prisma.chat.findUnique({
    where: { id }
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  // Delete all messages using the chatId
  await prisma.message.deleteMany({
    where: { chatId: chat.chatId }  // Use chatId, not id
  });

  // Check if chatTools record exists before deleting
  const chatToolsRecord = await prisma.chatTools.findUnique({
    where: { chatId: chat.chatId }
  });

  if (chatToolsRecord) {
    await prisma.chatTools.delete({
      where: { chatId: chat.chatId }
    });
  }

  // Then delete the chat itself
  return prisma.chat.delete({
    where: { id }
  });
}

export async function getChatItem(id: string) {
  return prisma.chat.findUnique({
    where: { id },
  });
}

export async function storeChatMessages(message: string, role: string, chatId: string) {
    // console.log('=== STORING CHAT ===');
    // console.log('MESSAGE:', message);
    // console.log('ROLE:', role);
    // console.log('CHAT ID:', chatId);

    let chat = await prisma.chat.findUnique({ where: { id: chatId } });
    // if(!chat) { // if chat doesn't exist, create it
    //     chat = await prisma.chat.create({ data: { id: chatId } });
    // }

    return prisma.message.create({
      data: {
        role,
        content: message,
        chat: {
          connect: {
            chatId: chatId
          }
        }
      }
  });
}

export async function getChatMessages(chatId: string) {
    return prisma.message.findMany(
      { 
        where: { chatId } ,
        select: {
          role: true,
          content: true,
        }
      }
    );
}

export async function storeChatTools(tools: string, chatId: string) {
    if (!chatId) throw new Error('chatId is required');
    
    // const toolString = JSON.stringify(tools);
    // console.log('=== STORING CHAT TOOLS ===');
    // console.log('TOOLS:', tools);
    // console.log('CHAT ID:', chatId);
    
    return prisma.chatTools.upsert({
        where: {
            chatId: chatId
        },
        update: {
            tools: tools
        },
        create: {
            chatId: chatId,
            tools: tools
        }
    });
}

export async function getChatTools(chatId: string) {
    if (!chatId) return null;
    
    const chatTools = await prisma.chatTools.findUnique({
        where: {
            chatId: chatId
        }
    });
    
    if (!chatTools) return null;
    return JSON.parse(chatTools.tools);
}

export async function storeChatHistory(message: ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam | ChatCompletionToolMessageParam | ChatCompletionMessage | undefined, chatId: string) {
    if (!chatId) throw new Error('chatId is required');
    // console.log('=== STORING CHAT HISTORY ===');
    // console.log('MESSAGE:', message);
    return prisma.chatHistory.create({
        data: {
            chatId,
            history: message as any
        }
    });
}

export async function getChatHistory(chatId: string): Promise<ChatCompletionMessage[]> {
    if (!chatId) throw new Error('chatId is required');
    
    const messages = await prisma.chatHistory.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' }
    });

    return messages.map(msg => (msg.history as unknown) as ChatCompletionMessage);
}