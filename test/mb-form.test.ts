import {  elementUpdated, fixture } from "@open-wc/testing-helpers"
import { html } from "lit-html"
import { expect } from "@open-wc/testing"
import { LitElement, property } from "lit-element"
import {querySelectorDeep} from 'query-selector-shadow-dom'
import EhrElement from '../src/medblocks/EhrElement'
import '../src/medblocks/form/form'
import MbForm from "../src/medblocks/form/form"

class BaseEhrElement extends EhrElement {
    @property({type: Object}) data: any
}

class TestComponent extends LitElement {
    @property({type: Array}) paths: string[]
    render(){
        return html`<mb-form>
        ${this.paths.map(path=>html`<base-ehr path=${path}></base-ehr>`)}
    </mb-form>`
    }
}

customElements.define('base-ehr', BaseEhrElement)
customElements.define('reactive-path', TestComponent)

describe('Form', ()=>{
    it('should load child elements', async ()=>{
        const form = await fixture<MbForm>(html`
        <mb-form>
            <base-ehr path="test/path" label="Hello there"></base-ehr>
        </mb-form>
        `)
        expect(Object.keys(form.mbElements)).to.eql(["test/path"])
    })

    it('should react to change in path', async ()=>{
        let paths = ['hello/there', 'another/path']
        const component = await fixture<TestComponent>(html`<reactive-path .paths=${paths}></reactive-path>`)
        const form = querySelectorDeep('mb-form') as MbForm
        expect(Object.keys(form.mbElements)).to.eql(["hello/there", "another/path"])
        component.paths = ['test2/another', 'changed/path']
        await elementUpdated(component)
        expect(Object.keys(form.mbElements)).to.eql(['test2/another', 'changed/path'])
        component.paths = ['test2/another', 'changed/path2']
        await elementUpdated(component)
        expect(Object.keys(form.mbElements)).to.eql(['test2/another', 'changed/path2'])
    })
    
    it('should set the data property properly', async ()=>{

    })

    it('should get data property from form', async ()=>{

    })

    it('should serialize to openEHR composition', async ()=>{

    })

    it('should deserialize from openEHR composition', async ()=>{

    })

    it('should serialize to FHIR resource', ()=>{

    })

    it('should serialize from FHIR resource', ()=>{
        
    })
})