import type { ActionFunction } from "remix";

import { redirect } from "remix";

import { db } from "../db";
import { withSession } from "../session";

export const action: ActionFunction = async ({ request }) => {
  return withSession(request, async (session) => {
    const sessionId = session.get("session");
    await db.session.delete({ where: { id: sessionId } });
    return redirect("/login");
  });
};

export default null;
