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
            readOnly: true,
            type: 'Leaf'
        }
        component = render(Leaf, { props })
    })
    it('must display label and null value when no input', async () => {
        expect(component.getByText('Best eye response (E)')).toBeInTheDocument()
        expect(component.getByText('-')).toBeInTheDocument()
    })
    it('must render value and label given an input', async () => {
        store.set({
            'testing/path|ordinal': 3,
            'testing/path|code': 'at0012',
            'testing/path|value': 'To sound'
        })
        await tick()
        expect(component.getByText('Best eye response (E)')).toBeInTheDocument()
        expect(component.getByText('3 - To sound')).toBeInTheDocument()
    })
    it('must react to input change and change value', async () => {
        store.set({
            'testing/path|ordinal': 3,
            'testing/path|code': 'at0012',
            'testing/path|value': 'To sound'
        })
        await tick()
        expect(component.getByText('Best eye response (E)')).toBeInTheDocument()
        expect(component.getByText('3 - To sound')).toBeInTheDocument()
        store.set({
            'testing/path|ordinal': 2,
            'testing/path|code': 'at0011',
            'testing/path|value': 'To pressure'
        })
        await tick()
        expect(component.getByText('Best eye response (E)')).toBeInTheDocument()
        expect(component.getByText('2 - To pressure')).toBeInTheDocument()
    })


    it('must not change the store in any way', async ()=> {
        store.set({
            'testing/path|ordinal': 3,
            'testing/path|code': 'at0012',
            'testing/path|value': 'To sound'
        })
        await tick()
        expect(component.getByText('Best eye response (E)')).toBeInTheDocument()
        expect(component.getByText('3 - To sound')).toBeInTheDocument()
        component.unmount()
        expect(get(store)).toEqual({
            'testing/path|ordinal': 3,
            'testing/path|code': 'at0012',
            'testing/path|value': 'To sound'
        })
    })
})


describe('advance', ()=>{
    
})