import '../../medblocks'
import { expect } from '@open-wc/testing'
import { elementUpdated, fixture } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../../src/medblocks/form/form'



describe('quantity validation test',()=>{
    it('empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-quantity path="test/1">
                <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
                </mb-quantity>
            </mb-form>
            `
        )
        await elementUpdated(form);
        expect(form.validate()).to.be.true
    })
    it('data',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-quantity  path="test/1">
                <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
                </mb-quantity>
            </mb-form>
            `
        )
        const quantity = querySelectorDeep('mb-quantity') as any;
        quantity.data = {magnitude:'12',unit:'cm'}
        await elementUpdated(form);
       expect(form.validate()).to.be.true
    })
    it('required but empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-quantity required path="test/1">
                <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
                </mb-quantity>
            </mb-form>
            `
        )
        await elementUpdated(form)
        expect(form.validate()).to.be.false
    })
    it('required with data',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-quantity  required path="test/1">
                <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
                </mb-quantity>
            </mb-form>
            `
        )
        const quantity = querySelectorDeep('mb-quantity') as any;
        quantity.data = {magnitude:'12',unit:'cm'}
        await elementUpdated(form)
        expect(form.validate()).to.be.true
    })
})