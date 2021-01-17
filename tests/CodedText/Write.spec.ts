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
    it('must render essential visual elements', () => {
        const options = component.getAllByRole("option")
        expect(options.map(option => option.textContent)).toEqual([
            'Select an option',
            'Present',
            'Not detected',
        ])
    })
    it('must change store on input change', async () => {
        let select = component.getByLabelText(tree.name)
        userEvent.selectOptions(select, "at1024")
        await tick()
        expect(get(store)).toEqual({
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        })
    })

    it('must display correct values from store', async () => {
        let select = component.getByLabelText(tree.name)
        store.set({
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        })
        await tick()
        expect(select).toHaveTextContent('Present')
    })

    it('must remove all related paths on destroying the component', async ()=> {
        let select = component.getByLabelText(tree.name)
        userEvent.selectOptions(select, "at1024")
        await tick()
        expect(get(store)).toEqual({
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        })
        component.unmount()
        expect(get(store)).toEqual({})
    })
})


describe('advance', ()=>{
    
})