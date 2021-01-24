
export const copy = async (path: string) => {
    await navigator.clipboard.writeText(path)
}