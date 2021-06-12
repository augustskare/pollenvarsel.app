import type { MetaFunction } from "remix";

import { Layout } from "../components/layout";

export let meta: MetaFunction = () => {
  return { title: "404" };
};

export default function FourOhFour() {
  return (
    <Layout title="404">
      <p className="content section">Side ikke funnet</p>
    </Layout>
  );
}
