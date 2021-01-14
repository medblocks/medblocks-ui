import "@testing-library/jest-dom"
import QuantityWrite from "../../src/rm/Quantity/QuantityWrite.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { rawTree } from "./webtemplate"
import { mockChanges } from "../utils"
import userEvent from '@testing-library/user-event'

describe('Quantity Write: Basic', ()=>{
    it('must render basic component', async ()=>{
        const tree = mockChanges(rawTree)
        const props = {
            tree,
            path: 'test/quantity',
            store: writable({})
        }
        const component = render(QuantityWrite, props)
        const quantity = await component.findByLabelText(tree.name)
        expect(quantity).toBeInTheDocument()
    })
    it('must write have writable input', async ()=>{
        const tree = mockChanges(rawTree)
        const store = writable({})
        const props = {
            tree,
            path: 'test/quantity',
            store
        }
        const component = render(QuantityWrite, props)
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(component.getByRole('spinbutton')).toHaveValue(23)
        
    })

    it('must write to store', async ()=>{
        const tree = mockChanges(rawTree)
        const store = writable({})
        const props = {
            tree,
            path: 'test/quantity',
            store
        }
        const component = render(QuantityWrite, props)
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(get(store)['test/quantity|magnitude']).toEqual(23)
        expect(get(store)['test/quantity|unit']).toEqual('mm[Hg]')
    })

    it('must delete units when no quantity', async ()=>{
        const tree = mockChanges(rawTree)
        const store = writable({})
        const props = {
            tree,
            path: 'test/quantity',
            store
        }
        const component = render(QuantityWrite, props)
        const quantity = await component.findByLabelText(tree.name)
        await userEvent.type(quantity, '23')
        expect(get(store)['test/quantity|magnitude']).toEqual(23)
        expect(get(store)['test/quantity|unit']).toEqual('mm[Hg]')
        await userEvent.type(quantity, '{backspace}{backspace}')
        expect(get(store)['test/quantity|magnitude']).toEqual(undefined)
        await tick()
        expect(get(store)['test/quantity|unit']).toEqual(undefined)
    })
})