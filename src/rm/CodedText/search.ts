import type { AxiosResponse } from "axios"

interface SuggestQueryBody {
    suggest: {
        autocomplete: {
            prefix: string,
            completion: {
                field: string,
                size: number,
                contexts: {
                    is_a: string[]
                }
            }
        }
    }
}
export function createQueryBody(searchTerm: string, isA: string[]): SuggestQueryBody {
    let suggestionBody: SuggestQueryBody = {
        suggest: {
            autocomplete: {
                prefix: searchTerm,
                completion: {
                    contexts: {
                        is_a: isA
                    },
                    size: 20,
                    field: "terms"
                }
            }
        }
    }
    return suggestionBody
}

export interface SearchResult {
    code: string,
    value: string,
    display: string,
    source?: any
}
export function parseSearchResult(searchResult: Promise<AxiosResponse<any>>): Promise<SearchResult[]> {
    return searchResult
        .then(result => {
            return result.data.suggest.autocomplete[0].options
        })
        .then(options=> options.map(option=>{
            let { _id, text, _source } = option
            let formattedResult: SearchResult = {
                code: _id,
                display: _source.name,
                value: _source.name,
                source: _source
            }
            return formattedResult
        }))
}

export function getIsA(expression: string) :string[]{
    return expression.split("|").map(a=>a.trim())
}