import '../../medblocks'
import { expect } from '@open-wc/testing'
import { elementUpdated, fixture } from '@open-wc/testing-helpers'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../../src/medblocks/form/form'



describe('checkbox validation test',()=>{
    it('empty',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-checkbox path="test/1"></mb-checkbox>
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
                <mb-checkbox path="test/1"></mb-checkbox>
            </mb-form>
            `
        )
        const checked = querySelectorDeep('mb-checkbox') as any;
        checked.data = true
        await elementUpdated(form);
       expect(form.validate()).to.be.true
    })
    it('required but empty',async ()=>{
        const form = await fixture<MbForm>(
            `
            <mb-form>
                <mb-checkbox required path="test/1"></mb-checkbox>
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
                <mb-checkbox required path="test/1"></mb-checkbox>
            </mb-form>
            `
        )
        const checked = querySelectorDeep('mb-checkbox') as any;
        checked.data = true
        await elementUpdated(form)
        expect(form.validate()).to.be.true
    })
})
