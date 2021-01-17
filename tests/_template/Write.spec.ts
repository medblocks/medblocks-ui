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
    
    })
    it('must change store on input change', async () => {
    
    })

    it('must display correct values from store', async () => {
        
    })

    it('must remove all related paths on destroying the component', async ()=> {

    })
})


describe('advance', ()=>{
    
})