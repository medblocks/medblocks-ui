import { CodedTextElement } from "../codedtext/CodedTextElement";
import EhrElement from "../EhrElement";
import { MbPlugin } from "./plugins";
import { unflatten } from "./utils";

const serialize = (mbElement: EhrElement) => {
    switch (mbElement.type) {
        case 'CodableConcept':
            const element = mbElement as CodedTextElement
            return {
                text: element.data?.value,
                coding: [
                    {
                        system: element.data?.terminology,
                        code: element.data?.code,
                        display: element.data?.value
                    }
                ]
            }
        case 'code': 
            const code = mbElement as CodedTextElement
            return {
                system: code.data?.terminology,
                code: code.data?.code,
                display: code.data?.value
            }
        default:
            return mbElement.data
    }
}
export const FHIRPlugin: MbPlugin = {
    async get(cdr, uid) {
        console.log(uid)
        const r = await cdr.get('')
        return r
    },

    async post(cdr, data) {
        console.log(data)
        const r = await cdr.post('')
        return r
    },

    export(mbElements){
        let transformed: {[path: string]: any} = {}
        Object.keys(mbElements).forEach(path=>{
            transformed[path] = serialize(mbElements[path])
        })
        return unflatten(transformed)
        // return mbElements
    },

    import(data){
        console.log(data)
    },

    getContext(path, ctx) {
        console.log({path, ctx})
    }
}