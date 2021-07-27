interface PollenvarselResponse {
  RegionForecast: {
    Days: {
      RegionDay: {
        Date: string;
        Regions: {
          Region: {
            Id: number;
            Name: string;
            Description?: string;
            Url: string;
            PollenTypes: {
              Pollen: {
                Id: number;
                Name: string;
                Distribution: number;
                Description: string;
              }[];
            };
            Distribution: 0;
          }[];
        };
      }[];
    };
  };
}

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

interface RegionPreview {
  id: string;
  slug: string;
  name: string;
  description: string;
}
