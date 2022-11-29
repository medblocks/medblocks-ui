import { AxiosInstance } from 'axios';

export interface SearchOptions {
  searchString: string;
  axios?: AxiosInstance;
  constraints?: string[];
  maxHits?: number;
  terminology?: string;
}
export interface SearchResult {
  code?: string;
  value?: string;
  star?: boolean;
  text: string;
  terminology?: string;
}

export type SearchFunction = (
  options: SearchOptions
) => Promise<SearchResult[]>;

const joinSnomedConstraints = (filters?: string[]) => {
  if (filters && filters?.length > 0) {
    return filters.join(' OR ');
  }
  return;
};

export const hermesPlugin: SearchFunction = async options => {
  try {
    const { searchString, axios, constraints, maxHits } = options;
    if (!axios) {
      return;
    }
    const response = await axios.get('/snomed/search', {
      params: {
        s: searchString,
        maxHits: maxHits,
        constraint: joinSnomedConstraints(constraints),
      },
    });
    return response.data.map(
      (term: {
        id: number;
        conceptId: number;
        term: string;
        preferredTerm: string;
      }) => ({
        code: term.conceptId,
        value: term.term,
        terminology: 'SNOMED-CT',
        // star: term.preferredTerm === term.term,
      })
    );
  } catch (e) {
    console.error(e);
    if (e.response?.status === 404) {
      return [];
    } else {
      throw e;
    }
  }
};
