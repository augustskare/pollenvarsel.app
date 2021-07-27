import type { User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "remix";

import { useRouteData, redirect } from "remix";

import { decrypt } from "../crypto";
import { db } from "../db";
import { forecast } from "../forecast";
import { withRequiredUser, withSession } from "../session";

import { Layout } from "../components/layout";

export const action: ActionFunction = async ({ request }) => {
  return withSession(request, (session) => {
    return withRequiredUser(session, async (user) => {
      const body = new URLSearchParams(await request.text());
      const region = body.get("region")
        ? parseInt(body.get("region") as string, 10)
        : null;

      await db.user.update({
        where: { id: user.id },
        data: { region, email: body.get("email")! },
      });
      return redirect("/profil");
    });
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return withSession(request, (session) => {
    return withRequiredUser(session, async (user) => {
      const regions = (await forecast(decrypt(user.apiKey))).regions();
      return {
        user: { email: user.email, region: user.region },
        regions,
      };
    });
  });
};

export default function Profile() {
  const { user, regions } =
    useRouteData<{ user: Pick<User, "email" | "region">; regions: Region[] }>();
  return (
    <Layout title={user.email}>
      <form className="content" method="post" style={{ padding: ".75rem" }}>
        <Input
          label="E-post"
          name="email"
          type="email"
          defaultValue={user.email}
        />

        <label
          style={{ marginBottom: ".25rem", display: "block" }}
          className="heading"
          htmlFor="region"
        >
          Velg din plassering
        </label>
        <select
          name="region"
          id="region"
          defaultValue={user.region || undefined}
        >
          {regions.map((region: any) => {
            return (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            );
          })}
        </select>
        <input type="submit" value="Oppdater profil" />
      </form>

      <form action="/signout" method="post">
        <button type="submit">Logg ut</button>
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
