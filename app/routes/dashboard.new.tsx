import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

// this is coming from new dashboard in app-sidebar.tsx
export const action: ActionFunction = async ({ request }) => {
    return redirect(`/new`);
};