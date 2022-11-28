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
  text?: boolean;
}

export type SearchFunction = (
  options: SearchOptions
) => Promise<SearchResult[]>;

export type GetConstraints = (filters: string[]) => string | undefined;
export const joinSnomedConstraints: GetConstraints = (filters: string[]) => {
  if (filters?.length > 0) {
    return filters.join(' OR ');
  }else{
    return;
  }
};

export const hermesPlugin: SearchFunction = async options => {
  try {
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
        label: term.term + 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It',
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
