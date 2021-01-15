const fs = require('fs')
const doctrine = require("doctrine");

const options = {
    filename: 'src/rm/Ordinal/OrdinalRead.svelte',
};
const file = fs.readFileSync(options.filename, "utf-8")
const matches = file.match(/\/\*\*\s*\n([^\*]|(\*(?!\/)))*\*\//g)

const parsed = matches.map(m=>doctrine.parse(m, {unwrap: true}))
console.log(JSON.stringify(parsed[1]))
