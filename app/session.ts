import type { User } from "@prisma/client";
import { LoaderFunction, redirect, Request, Session } from "remix";
import { json, Response } from "remix";
import { createCookieSessionStorage } from "remix";
import { db } from "./db";

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
  },
});

async function withSession(
  request: Request,
  next: (arg0: Session) => ReturnType<LoaderFunction>
) {
  let session = await getSession(request.headers.get("Cookie"));
  let response = await next(session);

  if (!(response instanceof Response)) {
    response = json(response);
  }

  response.headers.append("Set-Cookie", await commitSession(session));
  return response;
}

async function withUser(
  session: Session,
  next: (arg0: User | null) => ReturnType<LoaderFunction>
) {
  const sessionId = session.get("session");
  const userSession = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  return next(userSession?.user ?? null);
}

async function withRequiredUser(
  session: Session,
  next: (arg0: User) => ReturnType<LoaderFunction>
) {
  return withUser(session, (user) => {
    if (!user) {
      session.flash("error", "You need to be logged in");
      return redirect("/login");
    }

    return next(user);
  });
}

export {
  getSession,
  commitSession,
  destroySession,
  withSession,
  withUser,
  withRequiredUser,
};
