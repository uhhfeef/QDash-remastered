import { PrismaClient } from "@prisma/client";

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
    include: {
      messages: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createChatItem({ name, url, chatId }: { name: string; url: string; chatId: string }) {
  console.log('=== CREATING chat ITEM ===');
  console.log('NAME:', name);
  console.log('URL:', url);
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
  return prisma.chat.delete({
    where: { id },
  });
}

export async function getChatItem(id: string) {
  return prisma.chat.findUnique({
    where: { id },
  });
}

export async function storeChatMessages(message: string, role: string, chatId: string) {
    console.log('=== STORING CHAT ===');
    console.log('MESSAGE:', message);
    console.log('ROLE:', role);
    console.log('CHAT ID:', chatId);

    let chat = await prisma.chat.findUnique({ where: { id: chatId } });
    // if(!chat) { // if chat doesn't exist, create it
    //     chat = await prisma.chat.create({ data: { id: chatId } });
    // }

    return prisma.message.create({
      data: {
        role,
        content: message,
        chatId
      }
  });
}

