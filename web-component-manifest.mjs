import fs from 'fs'
const customElementsjson = fs.readFileSync('./dist/custom-elements.json')
const transform = `export default\n${customElementsjson.toString()}`
fs.writeFileSync('./dist/custom-elements.js',transform) 

