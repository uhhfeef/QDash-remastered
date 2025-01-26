import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
// import Navbar from "./components/Navbar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { json } from "@remix-run/node";
import { dashboards } from "./routes/chats.new";

import "./tailwind.css";
import { getAllChatItems } from "./utils/db.server";
import { initDuckDB } from "./services/[old]duckDbConfig";
import { useEffect } from "react";
// import useDuckDB from "./services/duckDbConfig";
import { DuckDBProvider, useDuckDB } from "./services/duckDbConfig";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// exposes this content to all pages. 
// TODO: chk if common practice
// TODO: refactor 
export const loader: LoaderFunction = async () => {
  try {
    const chats = await getAllChatItems();
    // console.log('chats:', chats); // works
    return json({
      chats: chats || []
    });
  } catch (error) {
    console.error('Error loading dashboards:', error);
    return json({
      chats: []
    });
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  // const { db, conn } = useDuckDB();

  // useEffect(() => {
  //   if (db) {
  //     console.log("DuckDB initialized successfully.");
  //   }
  // }, [db]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <DuckDBProvider>
          {/* <Navbar /> */}
          <SidebarProvider>
            <AppSidebar />
            {/* <main>
              {children}
            </main> */}
          </SidebarProvider>
          <ScrollRestoration />
          <Scripts />
        </DuckDBProvider>
      </body>
    </html>
  );
}

export default function App() {
  // everything is rendered in the app layout function not in here
  // this just returns outlet

  // useEffect(() => {
  //   console.log("Starting DuckDB initialization...");
  //   initDuckDB()
  //     .then(() => {
  //       console.log("DuckDB initialization completed successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Failed to initialize DuckDB:", error);
  //     });
  // }, []);
  return <Outlet />;
}
