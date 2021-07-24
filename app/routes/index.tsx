import { LoaderFunction, LinksFunction, redirect } from "remix";
import { useRouteData } from "remix";
import { Link } from "react-router-dom";

import { Layout } from "../components/layout";
import { Distribution } from "../components/distribution";

import { get } from "../data";

import styles from "../styles/index.css";
import { getSession } from "../session";
import { db } from "../db";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

async function withUser(request: Request) {}

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const t = session.get("session");

  try {
    const s = await db.session.findUnique({ where: { id: t } });
    const user = await db.user.findUnique({ where: { id: s?.userId } });
    const regions = await get();
    return {
      regions,
      region: user?.region,
    };
  } catch (error) {
    return redirect("/login");
  }
};

function Index() {
  let data = useRouteData<{ regions: Region[]; region?: string }>();
  const featured = data.regions.find((r) => r.id.toString() === data?.region);

  return (
    <Layout>
      <Link to="profil">Profil</Link>
      {featured && (
        <section className="section">
          <h2 className="heading">Din plassering</h2>

          <div className="featured section content">
            <div className="featured-inner">
              <p className="title-1">{featured.name}</p>

              <dl className="forcast">
                {featured.forecast[0].pollen.map((pollen) => {
                  return (
                    <div key={pollen.id} className="forcast-item">
                      <Distribution large dist={pollen.distribution} />
                      <div>
                        <dt className="forcast-name">{pollen.name}</dt>
                        <dd className="forcast-desc">{pollen.description}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            <Link className="link" to={`/${featured.slug}`}>
              Fullstendig varsel for {featured.name}
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="heading">Andre steder</h2>

        <ul className="list content">
          {data.regions.map((region) => {
            return (
              <li key={region.id} className="list-item">
                <Link to={region.slug}>{region.name}</Link>
                <p className="description">{region.forecast[0].description}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}

export default Index;
