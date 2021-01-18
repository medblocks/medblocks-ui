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
    it('must render value and label given an input', () => {
    
    })
    it('must react to input change and change value', async () => {
    
    })

    it('must display label and null value when no input', async () => {
        
    })

    it('must not change the store in any way', async ()=> {

    })
})


describe('advance', ()=>{
    
})