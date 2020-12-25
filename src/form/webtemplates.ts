import type {Tree, Extracted, Template, keyValue} from '../types/types'

function propogateContext(tree: Tree, parentContext: boolean) :Tree {
    if (tree.id === 'context' || parentContext){
        if (tree.children && tree.children.length){
            return {...tree, children: tree.children?.map(child=>propogateContext(child, true))} 
        } else {
            return {...tree, inContext: true}
        }
    }
    return {...tree, children: tree.children?.map(child=>propogateContext(child, false))}
}
function extractInputs(tree: Tree, path: string = '', parentName: string = ''): Extracted|Extracted[] {
    let { max, children, id, inputs, name: uncleanName, rmType, annotations, inContext, localizedName } = tree
    let newPath = `${path}/${id}`

    let name: string
    name = uncleanName || localizedName || id

    let inEvent: boolean = false
    if (['EVENT', 'POINT_EVENT'].includes(rmType)) {
        inEvent = true
        name = `${parentName} (${name})`
    }
    if (max > 1 || max == -1 || inEvent) {
        let label: string|undefined
        let repeatable: boolean = false
        if (max > 1 || max == -1) {
            repeatable = true
        }
        let extractedChildren: Extracted[]
        if (children && children.length) {
            extractedChildren = children
                .map(child => extractInputs(child, path = '', parentName = name))
                .filter(i => i)
                .flat()
            label = name
        } else {
            let extracted = extractInputs({...tree, max:0, id: ''}, path = '', parentName = name)
            if (!Array.isArray(extracted)) {
                extractedChildren = [extracted]
            } else {
                throw new Error(`Unexpected error at ${newPath}. Got multiple extracted children when children.length is 0`)
            }
        }

        return {
            type: 'Group',
            path: newPath,
            label,
            repeatable,
            children: extractedChildren
        }
    }
    if (inContext) {
        return {
            tree: {...tree, name},
            type: 'Context',
            path: newPath
        }
    }
    if (inputs && inputs.length) {
        return {
            tree: {...tree, name},
            type: 'Leaf',
            path: newPath
        }
    }
    
    if (children && children.length) {
        let extracted =  children
            .map(child =>
                extractInputs(child, newPath, name))
            .filter(i => i)
            .flat()
        return extracted
    
    } else {
        return {
            tree: {...tree, name},
            type: 'UnknownLeaf',
            path: newPath
        }
    }
}

function generateSchema(template: Template) :Extracted[] {
    const { tree } = template
    const contextTree = propogateContext(tree, false)
    let schema = extractInputs(contextTree)
    if (!Array.isArray(schema)){
        throw new Error('Top level template returned only one extracted')
    }
    return schema
}

function sanitizeValues(values: keyValue) :keyValue {
    let newValues = {};
    Object.entries(values).forEach(([key, value]) => {
        let unit = /(.*)\|unit/
        let unitSearch = key.match(unit)
        if (unitSearch){
            let magnitugePath = unitSearch[1] + '|magnitude'
            if (!values[magnitugePath]){
                return
            }
        }
        let newKey = key.length && key[0] == "/" ? key.slice(1) : key;
        newValues[newKey] = value;
    });
    return { ...newValues };
}
export { generateSchema, sanitizeValues }