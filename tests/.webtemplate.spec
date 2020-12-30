import {generateSchema} from "../src/form/webtemplates"
import anotherName from "../templates/better/anotherName.json"
import ehrNetwork from "../templates/ehrbase/ehrnetwork.json"
import {readdirSync, readFileSync} from "fs"
import path from "path"
import template from "../templates/better/BPActivityWeightjson.json";

const betterDir = "./templates/better"
const ehrbaseDir = "./templates/ehrbase"
const templatePaths = [
    ...readdirSync(ehrbaseDir).map(p=>path.join(ehrbaseDir, p)),
    ...readdirSync(betterDir).map(p=>path.join(betterDir, p)), 
]

describe("webtemplates", ()=>{
    it.each(templatePaths)('should return an array: %s', (path)=>{
        const file = readFileSync(path, 'utf-8') 
        const webtemplate = JSON.parse(file)
        const schema = generateSchema(webtemplate)
        expect(Array.isArray(schema)).toBe(true)
    })
})

describe('weird stochastic behavious', ()=>{
    it('should generate the same schema twice', ()=>{
        let t = {...template}
        expect(t).toEqual(t)
        let schema1 = generateSchema(t)
        let schema2 = generateSchema(t)
        expect(schema1).toEqual(schema2)
    })
})