import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { useRouteData } from "remix";

import { withRequiredUser, withSession } from "../session";
import { decrypt } from "../crypto";
import { forecast } from "../forecast";

import { Distribution } from "../components/distribution";
import { Layout } from "../components/layout";

import styles from "../styles/region.css";

export let handle = { hydrate: true };

export let meta: MetaFunction = ({ data }) => {
  return {
    title: data.name + " | Pollenvarsel",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader: LoaderFunction = async ({ request, params }) => {
  return withSession(request, (session) => {
    return withRequiredUser(session, async (user) => {
      return (await forecast(decrypt(user.apiKey))).region(params.region);
    });
  });
};

export default function Region() {
  const region = useRouteData<Region>();

  return (
    <Layout title={region.name}>
      <Tabs className="content section">
        <TabList className="tabs">
          {region.forecast.map((forecast) => {
            return (
              <Tab key={`tab-${forecast.date}`} className="tab">
                {forecast.date}
              </Tab>
            );
          })}
        </TabList>

        <TabPanels>
          {region.forecast.map((forecast) => {
            return (
              <TabPanel key={`panel-${forecast.date}`}>
                <p className="description">{forecast.description}</p>

                <table className="table">
                  <thead>
                    <tr>
                      <th className="heading table-cell">Type</th>
                      <th className="heading table-cell">Spredning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.pollen.map((pollen) => {
                      return (
                        <tr key={pollen.id} className="table-row">
                          <td className="table-cell">{pollen.name}</td>
                          <td className="distribution table-cell">
                            <Distribution dist={pollen.distribution} />
                            {pollen.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Layout>
  );
}
