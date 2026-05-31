import { useQuery } from "@tanstack/react-query";

export interface GlobalCovidData {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  affectedCountries: number;
  updated: number;
}

export interface CountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

export interface CountryCovidData {
  country: string;
  countryInfo: CountryInfo;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  updated: number;
}

export function useGlobalData() {
  return useQuery({
    queryKey: ["covid-global"],
    queryFn: async (): Promise<GlobalCovidData> => {
      const response = await fetch("https://disease.sh/v3/covid-19/all");
      if (!response.ok) throw new Error("Failed to fetch global data");
      return response.json();
    },
  });
}

export function useCountriesData() {
  return useQuery({
    queryKey: ["covid-countries"],
    queryFn: async (): Promise<CountryCovidData[]> => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries?sort=cases");
      if (!response.ok) throw new Error("Failed to fetch countries data");
      return response.json();
    },
  });
}

export function useCountryData(name: string) {
  return useQuery({
    queryKey: ["covid-country", name],
    queryFn: async (): Promise<CountryCovidData> => {
      const response = await fetch(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error("Failed to fetch country data");
      return response.json();
    },
    enabled: !!name,
  });
}
