import '@testing-library/jest-dom'
import Leaf from "../../src/composition/Leaf.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { rawTree } from "./webtemplate"
import { mockChanges } from "../utils"
import userEvent from '@testing-library/user-event'
describe('basic', () => {
    let component: RenderResult
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
        component = render(Leaf, { props })
    })
    it('must render essential visual elements', async () => {
        const quantity = await component.findByLabelText(tree.name)
        expect(quantity).toBeInTheDocument()
        await userEvent.type(quantity, '23')
        expect(component.getByRole('spinbutton')).toHaveValue(23)
    })
    it('must change store on input change', async () => {
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(get(store)['testing/path|magnitude']).toEqual(23)
        expect(get(store)['testing/path|unit']).toEqual('mm[Hg]')
    })

    it('must delete units when there is no quantity', async ()=>{
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(get(store)['testing/path|magnitude']).toEqual(23)
        expect(get(store)['testing/path|unit']).toEqual('mm[Hg]')
        await userEvent.type(quantity, '{backspace}{backspace}')
        await tick()
        expect(get(store)['testing/path|magnitude']).toEqual(undefined)
        expect(get(store)['testing/path|unit']).toEqual(undefined)
    })
    it('must display correct values from store', async () => {
        store.set({
            'testing/path|magnitude': 100,
            'testing/path|unit': 'mm[Hg]'
        })
        await tick()
        expect(component.getByRole('spinbutton')).toHaveValue(100)
        expect(component.getByRole('combobox')).toHaveValue('mm[Hg]')
    })

    it('must remove all related paths on destroying the component', async ()=> {
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(get(store)['testing/path|magnitude']).toEqual(23)
        expect(get(store)['testing/path|unit']).toEqual('mm[Hg]')
        component.unmount()
        await tick()
        expect(get(store)).toEqual({})
    })
})


describe('advance', ()=>{
    
})