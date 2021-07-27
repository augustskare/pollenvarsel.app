import type { LoaderFunction, LinksFunction } from "remix";
import { useRouteData } from "remix";
import { Link } from "react-router-dom";

import { withRequiredUser, withSession } from "../session";
import { decrypt } from "../crypto";
import { forecast } from "../forecast";

import { Layout } from "../components/layout";
import { Distribution } from "../components/distribution";

import styles from "../styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader: LoaderFunction = async ({ request }) => {
  return withSession(request, (session) => {
    return withRequiredUser(session, async (user) => {
      const region = user.region || undefined;
      return (await forecast(decrypt(user.apiKey))).index(region);
    });
  });
};

export default function Index() {
  let data = useRouteData<{ regions: RegionPreview[]; featured?: Region }>();

  return (
    <Layout>
      <Link to="profil">Profil</Link>
      {data.featured && (
        <section className="section">
          <h2 className="heading">Din plassering</h2>

          <div className="featured section content">
            <div className="featured-inner">
              <p className="title-1">{data.featured.name}</p>

              <dl className="forcast">
                {data.featured.forecast[0].pollen.map((pollen) => {
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

            <Link className="link" to={`/${data.featured.slug}`}>
              Fullstendig varsel for {data.featured.name}
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
                <p className="description">{region.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
