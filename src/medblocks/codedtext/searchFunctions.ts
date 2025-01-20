export interface SearchOptions {
  searchString: string;
  constraints?: string[];
  maxHits?: number;
  terminology?: string;
}
export interface SearchResult {
  code?: string;
  value?: string;
  text?: string;
  terminology?: string;
}
export interface InternalSearchResult {
  code?: string;
  value?: string;
  text?: string;
  terminology?: string;
}

export type SearchFunction = (
  options: SearchOptions
) => Promise<SearchResult[]>;
