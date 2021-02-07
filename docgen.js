const fs = require('fs')
const doctrine = require("doctrine");

const rmRoot = 'src/rm'
const paths = fs.readdirSync(rmRoot, {withFileTypes: true})
let files = {}


paths.filter(p=>p.isDirectory() && p.name !== 'helpers').forEach(p=>{
    const text = 'dv' + p.name;
    const result = text.replace( /([A-Z])/g, "_$1" ).toUpperCase();
    files[result] = {
        read: `${rmRoot}/${p.name}/${p.name}Read.svelte`,
        write: `${rmRoot}/${p.name}/${p.name}Write.svelte`,
    }
})

function getDocs(path) {
    try {
        const file = fs.readFileSync(path, "utf-8")
        const matches = file.match(/\/\*\*\s*\n([^\*]|(\*(?!\/)))*\*\//g)
        if (matches === null) {
            console.log(`${path}: No docs found`)
            return []
        }
        if (matches.length > 1) {
            console.warn(`${path}: Found multiple JSDocs in component`)
        }
        const parsed = matches.map(m=>doctrine.parse(m, {unwrap: true}))[0]['tags']
        return parsed
    }
    catch (e) {
        return []
    }

}
const leafOptions = getDocs("src/composition/Leaf.svelte")
const groupOptions = getDocs("src/composition/Group.svelte")
console.log("JsDocs: start")
let parsed = {}
Object.keys(files).forEach(key=>{
    parsed[key] = {
        read: [...leafOptions, ...getDocs(files[key]['read'])],
        write: [...leafOptions, ...getDocs(files[key]['write'])]
    }
})

parsed["Group"] = {
    read: groupOptions,
    write: groupOptions
}

fs.writeFileSync('./jsdocs.json', JSON.stringify(parsed, null, 2))
console.log("JsDocs: finished")