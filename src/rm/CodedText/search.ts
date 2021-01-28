import axios from "axios"
export interface SearchResult {
    code: string;
    value: string;
    display: string;
    preferred?: string;
    source?: any;
}
export type SearchFunction = (
    term: string,
    constraint: string,
    terminologyUrl: string
) => Promise<SearchResult[]>

export const hermesSearch: SearchFunction = async (term, constraint, terminologyUrl) => {
    if (!term) {
        return []
    }
    if (! (constraint && terminologyUrl)) {
        throw new Error("constraint or terminologyUrl not set")
    }
    const response = await axios.get(`${terminologyUrl}/v1/snomed/search`, {
        params: {
            s: term,
            constraint,
            maxHits: 15
        },
        headers: {
            "Accept": "application/json"
        }
    })
    if (response.status != 200) {
        return []
    }
    console.log(response)
    const resultFormatted: SearchResult[] = response.data.map((result: {
        // Hermes output type
        id: number,
        conceptId: number,
        term: string,
        preferredTerm: string
    }) => ({
        code: result.conceptId.toString(),
        value: result.preferredTerm,
        display: result.term
    }))
    return resultFormatted

}