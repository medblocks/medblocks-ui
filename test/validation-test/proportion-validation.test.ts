import '../../medblocks'
import { expect } from '@open-wc/testing'
import { elementUpdated, fixture } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../../src/medblocks/form/form'



describe('proportion validation test',()=>{
    it('empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-proportion type='unitary' path="test/1"></mb-proportion>
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
                <mb-proportion type='unitary' path="test/1"></mb-proportion>
            </mb-form>
            `
        )
        const percent = querySelectorDeep('mb-proportion') as any;
        percent.data = {numerator: 0.5, denominator: 1, type: 1}
        await elementUpdated(form);
       expect(form.validate()).to.be.true
    })
    it('required but empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-proportion type='unitary' required path="test/1"></mb-proportion>
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
                <mb-proportion type='unitary' required path="test/1"></mb-proportion>
            </mb-form>
            `
        )
        const proportion = querySelectorDeep('mb-proportion') as any;
        proportion.data = {numerator: 123, denominator: 100, type: 2}
        await elementUpdated(form)
        const validation = form.validate()
        expect(validation).to.be.false
    })
})