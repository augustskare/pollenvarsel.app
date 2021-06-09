import type { MetaFunction } from 'remix';

export let meta: MetaFunction = () => {
  return { title: '404' };
};

export default function FourOhFour() {
  return <h1>404</h1>;
}
