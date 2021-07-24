import { User } from "@prisma/client";
import { ActionFunction, LoaderFunction, useRouteData } from "remix";
import { Layout } from "../components/layout";
import { get } from "../data";
import { db } from "../db";
import { getSession } from "../session";

export const action: ActionFunction = async ({ request }) => {
  const body = new URLSearchParams(await request.text());
  const region = body.get("region");

  const session = await getSession(request.headers.get("Cookie"));
  const t = session.get("session");
  const s = await db.session.findUnique({ where: { id: t } });
  if (s) {
    await db.user.update({
      where: { id: s.userId },
      data: { region },
    });
  }

  return "/profil";
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const t = session.get("session");
  const data = await get();
  const s = await db.session.findUnique({ where: { id: t } });
  if (s) {
    const user = await db.user.findUnique({ where: { id: s.userId } });

    return {
      user: { email: user?.email, region: user?.region },
      regions: data,
    };
  }

  return {};
};

export default function Profile() {
  const { user, regions } =
    useRouteData<{ user: Pick<User, "email" | "region">; regions: Region[] }>();
  return (
    <Layout title={user.email}>
      <form className="content" method="post" style={{ padding: ".75rem" }}>
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
    </Layout>
  );
}
