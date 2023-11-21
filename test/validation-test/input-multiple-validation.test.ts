import '../../medblocks'
import { expect } from '@open-wc/testing'
import { elementUpdated, fixture } from '@open-wc/testing-helpers'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../../src/medblocks/form/form'



describe('input-multiple validation test',()=>{
    it('empty',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-input-multiple path="test/1"></mb-input-multiple>
            </mb-form>
            `
        )
        await elementUpdated(form);
        expect(form.validate()).to.be.true
    })
    it('data',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-input-multiple path="test/1"></mb-input-multiple>
            </mb-form>
            `
        )
        const input = querySelectorDeep('mb-input-multiple') as any;
        input.data = ['testUnit'];
        await elementUpdated(form);
       expect(form.validate()).to.be.true
    })
    it('required but empty',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-input-multiple required path="test/1"></mb-input-multiple>
            </mb-form>
            `
        )
        await elementUpdated(form)
        expect(form.validate()).to.be.false
    })
    it('required with data',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-input-multiple required path="test/1"></mb-input-multiple>
            </mb-form>
            `
        )
        const input = querySelectorDeep('mb-input-multiple') as any;
        input.data = ['testUnit']
        await elementUpdated(form)
        expect(form.validate()).to.be.true
    })
})
