import "@testing-library/jest-dom"
import { render } from "@testing-library/svelte"
import { writable } from "svelte/store"
import TextWrite from "../../src/rm/Text/TextWrite.svelte"
import { mockChanges } from "../utils"
import { rawTree } from "./template"

describe('Text Write - Basic', ()=>{
    it('must show a text area', ()=>{
        const tree = mockChanges(rawTree)
        const props = {
            store : writable({}),
            path: 'test/path',
            tree
        }
        const component = render(TextWrite, props)
        expect(component.getByLabelText(tree.name)).toBeInTheDocument()
    })
})