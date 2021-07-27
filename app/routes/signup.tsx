import type { ActionFunction, LoaderFunction } from "remix";

import { json, redirect, useRouteData } from "remix";
import { assert, define, object, size, string, StructError } from "superstruct";

import { Layout } from "../components/layout";

import { encrypt } from "../crypto";
import { db } from "../db";

var matcher =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const Email = define<string>("Email", (value) => matcher.test(value as string));

const User = object({
  email: Email,
  password: size(string(), 1, Infinity),
  apiKey: size(string(), 1, Infinity),
});

import { withSession } from "../session";
import { Prisma } from "@prisma/client";

async function createUser(body: URLSearchParams) {
  const data = Object.fromEntries(body);
  try {
    assert(data, User);
    await db.user.create({
      data: {
        email: data.email,
        password: encrypt(data.password),
        apiKey: encrypt(data.apiKey),
      },
    });
  } catch (error) {
    let er: Record<string, string> = {};
    console.log(error);
    if (error instanceof StructError) {
      for (const failure of error.failures()) {
        let msg = "er ugydlig";
        if (failure.value === undefined || failure.value === "") {
          msg = "er påkrevd";
        }
        er[failure.key] = `${failure.key} ${msg}`;
      }
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        er = {
          email: "E-post er ugydlig eller allerede brukt",
        };
      }
    } else {
      er = { email: "det oppstod en feil" };
    }
    throw er;
  }
}

export const action: ActionFunction = async ({ request }) => {
  return withSession(request, async (session) => {
    const body = new URLSearchParams(await request.text());

    try {
      await createUser(body);
      return "/";
    } catch (error) {
      session.flash("error", error);
      return redirect("/signup");
    }
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return withSession(request, (session) => {
    return json({ error: session.get("error"), data: session.get("data") });
  });
};

function Signup() {
  const { error = {}, data = {} } = useRouteData();
  console.log(error);
  return (
    <Layout>
      <form className="content" method="post" style={{ padding: ".75rem" }}>
        <Input
          label="E-post"
          type="text"
          id="email"
          name="email"
          defaultValue={data.email}
          error={error.email}
        />
        <Input
          label="Passord"
          type="text"
          id="password"
          name="password"
          defaultValue={data.password}
          error={error.password}
        />
        <Input
          label="Api nøkkel"
          type="text"
          id="apiKey"
          name="apiKey"
          defaultValue={data.apiKey}
          error={error.apiKey}
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

export default Signup;
