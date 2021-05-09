import {  fixture } from "@open-wc/testing-helpers"
import { html } from "lit-html"
import MbForm from "../src/medblocks/form/form"
import '../medblocks'

describe('Form', ()=>{
    it('should have all children updated', async ()=>{
        const form = await fixture<MbForm>(html`
        <mb-form>
            <mb-input path="test/path" label="Hello there"></mb-input>
            <mb-input path="hello/path" label="Hello there"></mb-input>
        </mb-form>
        `)
        
        console.log(form.pathElementMap)

    })
})