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

// Sidebar functions
export async function getAllSidebarItems() {
  return prisma.sidebar.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createSidebarItem({ name, url, createdAt }: { name: string; url: string; createdAt: Date }) {
  console.log('=== CREATING SIDEBAR ITEM ===');
  console.log('NAME:', name);
  console.log('URL:', url);
  console.log('CREATED AT:', createdAt);
  return prisma.sidebar.create({
    data: {
      name,
      url,
      createdAt,
    },
  });
}

export async function deleteSidebarItem(id: string) {
  console.log('=== DELETING SIDEBAR ITEM ===');
  console.log('ID:', id);
  return prisma.sidebar.delete({
    where: { id },
  });
}

export async function getSidebarItem(id: string) {
  return prisma.sidebar.findUnique({
    where: { id },
  });
}
