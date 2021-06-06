import { AxiosInstance } from 'axios';
export interface SearchOptions {
  searchString: string;
  axios: AxiosInstance;
  constraint?: string;
  maxHits?: number;
}
export interface SearchResult {
  value: string;
  label?: string;
  star?: boolean;
}

export type SearchFunction = (
  options: SearchOptions
) => Promise<SearchResult[]>;

export function joinSnomedConstraints(filters: string[]) {
  if (filters?.length > 0) {
    return filters.join(' OR ');
  } else {
    return;
  }
}

export const hermesPlugin: SearchFunction = async options => {
  const { searchString, axios, constraint, maxHits } = options;
  const response = await axios.get('/snomed/search', {
    params: {
      s: searchString,
      maxHits: maxHits,
      constraint: constraint,
    },
  });
  return response.data.map(
    (term: {
      id: number;
      conceptId: number;
      term: string;
      preferredTerm: string;
    }) => ({
      value: term.conceptId,
      label: term.term,
    })
  );
};
