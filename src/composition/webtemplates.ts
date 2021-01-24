import type { Tree, Extracted, Template, keyValue, UITemplate } from '../types/types'

function propogateContext(tree: Tree, parentContext: boolean): Tree {
    if (tree.id === 'context' || parentContext) {
        if (tree.children && tree.children.length) {
            return { ...tree, children: tree.children?.map(child => propogateContext(child, true)) }
        } else {
            return { ...tree, inContext: true }
        }
    }
    return { ...tree, children: tree.children?.map(child => propogateContext(child, false)) }
}
function extractInputs(tree: Tree, path: string, parentName: string, config: any, readOnly: boolean): Extracted | Extracted[] {
    let { max, children, id, inputs, name: uncleanName, rmType, annotations, inContext, localizedName, aqlPath } = tree
    let newPath = path ? `${path}/${id}` : `${id}`
    let options = config[aqlPath]?.[readOnly ? 'read' : 'write']
    let name: string
    name = uncleanName || localizedName || id

    let inGroup: boolean = false
    let newParentName: string | undefined
    const eventTypes = ['EVENT', 'POINT_EVENT', 'INTERVAL_EVENT']
    if (eventTypes.includes(rmType)) {
        inGroup = true
        name = `${parentName} (${name})`
        // name = ''
    }
    if (['OBSERVATION'].includes(rmType)) {
        inGroup = true
        if (children && children?.filter(child => eventTypes.includes(child.rmType)).length > 0) {
            newParentName = name
            name = ''
        }
    }
    if (max > 1 || max == -1 || inGroup) {
        let label: string | undefined
        let repeatable: boolean = false
        if (max > 1 || max == -1) {
            repeatable = true
        }
        let extractedChildren: Extracted[]
        if (children && children.length) {
            extractedChildren = children
                .map(child => extractInputs(child, path = '', parentName = newParentName || name, config, readOnly))
                .filter(i => i)
                .flat()
            label = name
        } else {
            let extracted = extractInputs({ ...tree, max: 0, id: '' }, path = '', parentName = newParentName || name, config, readOnly)
            if (!Array.isArray(extracted)) {
                extractedChildren = [extracted]
            } else {
                throw new Error(`Unexpected error at ${newPath}. Got multiple extracted children when children.length is 0`)
            }
        }

        return {
            type: 'Group',
            ...options,
            path: newPath,
            rmType,
            aqlPath,
            label,
            repeatable,
            children: extractedChildren
        }
    }
    if (inContext) {
        return {
            tree: { ...tree, name },
            type: 'Context',
            path: newPath,
            aqlPath,
            ...options
        }
    }
    if (inputs && inputs.length) {
        return {
            tree: { ...tree, name },
            type: 'Leaf',
            path: newPath,
            aqlPath,
            ...options
        }
    }

    if (children && children.length) {
        let extracted = children
            .map(child =>
                extractInputs(child, newPath, name, config, readOnly))
            .filter(i => i)
            .flat()
        return extracted

    } else {
        return {
            tree: { ...tree, name },
            type: 'UnknownLeaf',
            path: newPath,
            aqlPath,
            ...options
        }
    }
}

function generateSchema(template: Template, configuration: any = {}, readOnly: boolean): UITemplate {
    const { tree } = template
    const contextTree = propogateContext(tree, false)
    let schema = extractInputs(contextTree, '', '', configuration, readOnly)
    if (!Array.isArray(schema)) {
        throw new Error('Top level template returned only one extracted')
    }
    const uiTemplate = {
        options: configuration.global || {},
        schema
    }
    return uiTemplate
}

function sanitizeValues(values: keyValue): keyValue {
    let newValues = {};
    Object.entries(values).forEach(([key, value]) => {
        let unit = /(.*)\|unit/
        let unitSearch = key.match(unit)
        if (unitSearch) {
            let magnitugePath = unitSearch[1] + '|magnitude'
            if (!values[magnitugePath]) {
                return
            }
        }
        let newKey = key.length && key[0] == "/" ? key.slice(1) : key;
        newValues[newKey] = value;
    });
    return { ...newValues };
}

function rehydrateValues(values: keyValue): keyValue {
    let newValues = {}
    Object.entries(values).forEach(([key, value]) => {
        let newKey = key.length && key[0] != "/" ? `/${key}` : key
        newValues[newKey] = value
    })
    return newValues
}

export { generateSchema, sanitizeValues, rehydrateValues }