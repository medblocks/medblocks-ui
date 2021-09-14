import '../../medblocks'
import { expect } from '@open-wc/testing'
import { elementUpdated, fixture } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../../src/medblocks/form/form'



describe('date validation test',()=>{
    it('empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-date path="test/1"></mb-date>
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
                <mb-date path="test/1"></mb-date>
            </mb-form>
            `
        )
        const date = querySelectorDeep('mb-date') as any;
        date.data = '2021-10-01'
        await elementUpdated(form);
       expect(form.validate()).to.be.true
    })
    it('required but empty',async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-date required path="test/1"></mb-date>
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
                <mb-date required path="test/1"></mb-date>
            </mb-form>
            `
        )
        const date = querySelectorDeep('mb-date') as any;
        date.data = '2021-10-01'
        await elementUpdated(form)
        expect(form.validate()).to.be.true
    })
})