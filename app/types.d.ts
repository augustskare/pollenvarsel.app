interface Region {
  id: number;
  name: string;
  forecast: {
    date: string;
    distribution: number;
    description: string;
    pollen: {
      name: string;
      description: string;
      distribution: number;
      id: number;
    }[];
  }[];
  slug: string;
}
