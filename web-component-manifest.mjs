import fs from 'fs'

const input = './dist/custom-elements.json'
const output = './dist/custom-elements.js'
const customElementsjson = fs.readFileSync(input)
const transform = `export default\n${customElementsjson.toString()}`

fs.writeFileSync(output,transform) 
console.log(`Generated ${output} from ${input}`)