
export const copy = async (path: string) => {
    await navigator.clipboard.writeText(path)
}

export const partition = <T>(array: Array<T>, isValid: (a:T)=>boolean): [Array<T>, Array<T>] => {
    return array.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
    }