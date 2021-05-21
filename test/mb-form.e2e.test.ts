import { expect } from '@open-wc/testing'
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../src/medblocks/form/form'
import '../medblocks'

describe('Form e2e', ()=>{
    it('should set the data property properly', async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-input path="test/1"></mb-input>
            </mb-form>
            `
        )
        form.data = {'test/1': 'Hello there'}
        const e: any = await oneEvent(form, 'mb-input')
        expect(e.target.data).to.eql({'test/1': 'Hello there'})
        await elementUpdated(form)
        const input = querySelectorDeep('input') as HTMLInputElement;
        expect(input.value).to.eq('Hello there')
    })

    it('should get data property from form', async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-input path="test/1" .data=${"Hello test!"}></mb-input>
            </mb-form>
            `)
        expect(form.data).to.eql({'test/1': 'Hello test!'})
        
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