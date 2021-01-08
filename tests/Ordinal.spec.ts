import OrdinalWrite from "../src/rm/Ordinal/OrdinalWrite.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import '@testing-library/jest-dom'
import type { writableKeyValue } from "../src/types/types"
import { tick } from "svelte"

const rawTree = {
    "id": "ordinal_value",
    "localizedName": "Best eye response (E)",
    "rmType": "DV_ORDINAL",
    "nodeId": "",
    "min": 0,
    "max": 1,
    "localizedNames": {
        "en": "Best eye response (E)"
    },
    "localizedDescriptions": {
        "en": "Best response of eyes to test stimulus."
    },
    "aqlPath": "/content[openEHR-EHR-OBSERVATION.glasgow_coma_scale.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0009]/value",
    "inputs": [{
        "type": "CODED_TEXT",
        "list": [{
            "value": "at0010",
            "label": "None",
            "localizedLabels": {
                "en": "None"
            },
            "localizedDescriptions": {
                "en": "No eye opening at any time, no interfering factor. For example: eyes closed by local swelling."
            },
            "ordinal": 1
        }, {
            "value": "at0011",
            "label": "To pressure",
            "localizedLabels": {
                "en": "To pressure"
            },
            "localizedDescriptions": {
                "en": "Eyes opening after finger tip stimulus."
            },
            "ordinal": 2
        }, {
            "value": "at0012",
            "label": "To sound",
            "localizedLabels": {
                "en": "To sound"
            },
            "localizedDescriptions": {
                "en": "Eyes opening after spoken or shouted request. Not to be confused with wakening of a sleeping person."
            },
            "ordinal": 3
        }, {
            "value": "at0013",
            "label": "Spontaneous",
            "localizedLabels": {
                "en": "Spontaneous"
            },
            "localizedDescriptions": {
                "en": "Eyes open before stimulus."
            },
            "ordinal": 4
        }]
    }]
}
const mockChanges = (tree) => {
    return { ...tree, name: tree.localizedName }
}
describe('Basic Write', () => {
    let ordinal: RenderResult
    let store: writableKeyValue
    let tree
    beforeEach(() => {
        tree = mockChanges(rawTree)
        store = writable({})
        const props = {
            tree,
            path: 'testing/path',
            store
        }
        ordinal = render(OrdinalWrite, { props })
    })
    it('must render all options', () => {
        const options = ordinal.getAllByRole("option")
        expect(options.map(option => option.textContent)).toEqual([
            'Select an option',
            '1. None',
            '2. To pressure',
            '3. To sound',
            '4. Spontaneous'
        ])
    })
    it('must select correct values', async () => {
        let select = ordinal.getByLabelText(tree.name)
        expect(select).toBeInTheDocument()
        expect(select).toHaveTextContent('Select an option')
        await fireEvent.change(select, { target: { value: "2" } })
        expect(select).toHaveTextContent('2. To pressure')
        expect(get(store)).toEqual({
            'testing/path|ordinal': 2,
            'testing/path|code': 'at0011',
            'testing/path|value': 'To pressure'
        })
    })

    it('it must display correct value', async ()=>{
        let select = ordinal.getByLabelText(tree.name)
        store.set({
            'testing/path|ordinal': 3,
            'testing/path|code': 'at0012',
            'testing/path|value': 'To sound'
        })
        await tick()
        expect(select).toHaveTextContent('3. To sound')
    })
})

describe('Advanced Write', ()=>{
    let tree = mockChanges(rawTree)
    it('must display defaultOrdinal', async ()=>{
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            defaultOrdinal: 4
        }
        let ordinal = render(OrdinalWrite,{props})
        const select = ordinal.getByLabelText(tree.name)
        expect(select).toHaveDisplayValue("4. Spontaneous")
    })
    it ('must render custom class on select', ()=>{
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            selectWrapperClass: 'custom-select-class'
        }
        let ordinal = render(OrdinalWrite, {props})
        const select = ordinal.getByLabelText(tree.name)
        const selectWrapper = select.parentElement
        expect(selectWrapper?.classList).toContain('custom-select-class')
    })
    it('must accept custom title', async ()=>{
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            label: 'Custom Label'
        }
        let ordinal = render(OrdinalWrite, {props})
        const select = ordinal.getByLabelText('Custom Label')
        expect(select).toBeInTheDocument()
    })
    it('must render based on displayBool', async ()=>{
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            displayBool: false
        }
        let ordinal = render(OrdinalWrite, {props})
        expect(()=>ordinal.getByLabelText(tree.name)).toThrow()

    })
    it('must render based on displayFunction', async ()=>{
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            displayFunction: (store) => {
                return false
            }
        }
        let ordinal = render(OrdinalWrite, {props})
        expect(()=>ordinal.getByLabelText(tree.name)).toThrow()
    })
})