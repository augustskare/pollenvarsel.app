import type { LoaderFunction, LinksFunction } from "remix";
import { useRouteData } from "remix";
import { Link } from "react-router-dom";

import { Layout } from "../components/layout";
import { Distribution } from "../components/distribution";

import { get } from "../data";

import styles from "../styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader: LoaderFunction = async () => {
  return get();
};

function Index() {
  let data = useRouteData<Region[]>();
  const featured = data[0];

  return (
    <Layout>
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

      <section className="section">
        <h2 className="heading">Andre steder</h2>

        <ul className="list content">
          {data.map((region) => {
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
