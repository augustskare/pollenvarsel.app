import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";

import { withSession, withUser } from "../session";
import { decrypt } from "../crypto";
import { db } from "../db";

import { Layout } from "../components/layout";

export const action: ActionFunction = async ({ request }) => {
  return withSession(request, async (session) => {
    const body = new URLSearchParams(await request.text());

    const email = body.get("email");
    const password = body.get("password");

    if (email && password) {
      try {
        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (user && password === decrypt(user.password)) {
          const userSession = await db.session.create({
            data: {
              userId: user.id,
              expirationDate: new Date(),
            },
          });

          session.set("session", userSession.id);
          return redirect("/");
        } else {
          throw new Error("Invalid user");
        }
      } catch (error) {
        console.log(error);
      }
    }

    return redirect("/login");
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return withSession(request, (session) => {
    return withUser(session, (user) => (user ? redirect("/") : {}));
  });
};

export default function Login() {
  const data = {};
  return (
    <Layout>
      <form className="content" method="post" style={{ padding: ".75rem" }}>
        <Input
          label="E-post"
          type="text"
          id="email"
          name="email"
          defaultValue={data.email}
        />
        <Input
          label="Passord"
          type="password"
          id="password"
          name="password"
          defaultValue={data.password}
        />

        <input type="submit" />
      </form>
    </Layout>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: ".5rem" }}>
      <label
        style={{ marginBottom: ".25rem", display: "block" }}
        className="heading"
        htmlFor={props.id}
      >
        {label}
      </label>
      <input {...props} />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
