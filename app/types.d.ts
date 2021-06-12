interface Region {
  id: number;
  name: string;
  forecast: {
    date: string;
    distribution: number;
    description: string;
    pollen: Pollen[];
  }[];
  slug: string;
}

interface Pollen {
  name: string;
  description: string;
  distribution: number;
  id: number;
}

interface RawRegion {
  date: string;
  regions: {
    id: number;
    name: string;
    description: "";
    url: string;
    pollentypes: any;
    distribution: number;
    pollen: {
      id: number;
      name: string;
      distribution: number;
      description: string;
    }[];
  }[];
}
