const fs = require('fs')
const doctrine = require("doctrine");

const root = 'src/rm'
const paths = fs.readdirSync(root, {withFileTypes: true})
let files = {}


paths.filter(p=>p.isDirectory() && p.name !== 'helpers').forEach(p=>{
    const text = 'dv' + p.name;
    const result = text.replace( /([A-Z])/g, "_$1" ).toUpperCase();
    files[result] = {
        read: `${root}/${p.name}/${p.name}Read.svelte`,
        write: `${root}/${p.name}/${p.name}Write.svelte`,
    }
})

function getDocs(path) {
    try {
        const file = fs.readFileSync(path, "utf-8")
        const matches = file.match(/\/\*\*\s*\n([^\*]|(\*(?!\/)))*\*\//g)
        if (matches == null) {
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

console.log("JsDocs: start")
let parsed = {}
Object.keys(files).forEach(key=>{
    parsed[key] = {
        read: getDocs(files[key]['read']),
        write: getDocs(files[key]['write'])
    }
})
fs.writeFileSync('./jsdocs.json', JSON.stringify(parsed, null, 2))
console.log("JsDocs: finished")