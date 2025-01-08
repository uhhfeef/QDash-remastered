import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, useParams } from "@remix-run/react";

// export async function loader({
//     request,
//   }: LoaderFunctionArgs) {
//     const user = await getUser(request);
//     return json({
//       displayName: user.displayName,
//       email: user.email,
//     });
//   }
  

export default function Chats() {
  const { chatId } = useParams();
  return (
    <div className="flex-1 flex flex-col h-full">
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1>Chats with id: {chatId}</h1>
        </div>
    </div>
  );
}