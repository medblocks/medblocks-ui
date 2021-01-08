import '@testing-library/jest-dom'
import Leaf from "../../src/form/Leaf.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { rawTree } from "./webtemplate"
import { mockChanges } from "../utils"
describe('Basic Write - Leaf', () => {
    let ordinal: RenderResult
    let store: writableKeyValue
    let tree
    beforeEach(() => {
        tree = mockChanges(rawTree)
        store = writable({})
        const props = {
            tree,
            path: 'testing/path',
            store,
            readOnly: false,
            type: 'Leaf'
        }
        ordinal = render(Leaf, { props })
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

    it('it must display correct value', async () => {
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
describe('Advanced Write', () => {
    let tree = mockChanges(rawTree)
    it('must display defaultOrdinal', async () => {
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            defaultOrdinal: 4,
            type: 'Leaf',
            readOnly: false
        }
        let ordinal = render(Leaf, { props })
        const select = ordinal.getByLabelText(tree.name)
        expect(select).toHaveDisplayValue("4. Spontaneous")
    })
    it('must render custom class on select', () => {
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            selectWrapperClass: 'custom-select-class',
            type: 'Leaf',
            readOnly: false
        }
        let ordinal = render(Leaf, { props })
        const select = ordinal.getByLabelText(tree.name)
        const selectWrapper = select.parentElement
        expect(selectWrapper?.classList).toContain('custom-select-class')
    })
    it('must accept custom title', async () => {
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            label: 'Custom Label',
            type: 'Leaf',
            readOnly: false
        }
        let ordinal = render(Leaf, { props })
        const select = ordinal.getByLabelText('Custom Label')
        expect(select).toBeInTheDocument()
    })
    it('must render based on display boolean', async () => {
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            display: false,
            type: 'Leaf',
            readOnly: false
        }
        let ordinal = render(Leaf, { props })
        expect(() => ordinal.getByLabelText(tree.name)).toThrow()

    })
    it('must render based on displayFunction', async () => {
        let store = writable({})
        const props = {
            tree,
            path: 'custom/path',
            store,
            displayFunction: (store) => {
                return false
            },
            type: 'Leaf',
            readOnly: false
        }
        let ordinal = render(Leaf, { props })
        expect(() => ordinal.getByLabelText(tree.name)).toThrow()
    })
})