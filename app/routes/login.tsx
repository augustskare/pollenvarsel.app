import { ActionFunction, redirect } from "remix";
import { Layout } from "../components/layout";
import { decrypt, encrypt } from "../crypto";
import { db } from "../db";

import { getSession, commitSession } from "../session";

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  const body = new URLSearchParams(await request.text());

  const email = body.get("email");
  const password = body.get("password");
  if (email && password) {
    console.log(email);
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
        return redirect("/", {
          headers: { "Set-Cookie": await commitSession(session) },
        });
      } else {
        throw new Error("Invalid user");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return "/login";
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
