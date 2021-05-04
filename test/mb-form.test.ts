import { fixture, elementUpdated } from "@open-wc/testing-helpers"
import { html } from "lit-html"
import { MbForm } from "../index"
import "../medblocks"

describe('mb-form', ()=>{
    it('should get initial value', async ()=>{
    const form = await fixture<MbForm>(html`
    <mb-form>
        <mb-input path="hello there"></mb-input>
    </mb-form>
    `)
    await elementUpdated(form)
    console.log(form.data)
    })
    
})