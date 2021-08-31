import { elementUpdated, fixture } from "@open-wc/testing-helpers"
import { html } from "lit-html"
import { expect } from "@open-wc/testing"
import { LitElement, property } from "lit-element"
import { querySelectorDeep } from 'query-selector-shadow-dom'
import EhrElement from '../src/medblocks/EhrElement'
import '../src/medblocks/form/form'
import MbForm from "../src/medblocks/form/form"

class BaseEhrElement extends EhrElement {
    @property({ type: Object }) data: any
}

class TestComponent extends LitElement {
    @property({ type: Array }) paths: string[]
    render() {
        return html`<mb-form>
    ${this.paths.map(path => html`<base-ehr path=${path}></base-ehr>`)}
</mb-form>`
    }
}
class RepeateableTest extends LitElement {
    @property({ type: Number }) i: number = 2;
    render() {
        return html`<mb-form>
    ${[...Array(this.i)].map((_, i) => html`
    <base-ehr path=${`path/${i}`}> </base-ehr>`)} </mb-form>`
    }
}

class RepeateableTest2 extends LitElement {
    @property({ type: Number }) i: number = 2;
    render() {
        return html`<mb-form>
    ${[...Array(this.i)].map((_, i) => html`
    <div>
        <base-ehr path=${`path/${i}`}> </base-ehr> 
    </div>`)} </mb-form>`
    }
}
customElements.define('repeat-element', RepeateableTest)
customElements.define('repeat-element2', RepeateableTest2)
customElements.define('base-ehr', BaseEhrElement)
customElements.define('reactive-path', TestComponent)

describe('Form', () => {
    it('should load child elements', async () => {
        const form = await fixture<MbForm>(html`
        <mb-form>
            <base-ehr path="test/path" label="Hello there"></base-ehr>
        </mb-form>
        `)
        expect(Object.keys(form.mbElements)).to.eql(["test/path"])
    })

    it('should react to change in path', async () => {
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

    it('should react to deletion in path', async () => {
        let paths = ['hello/there', 'another/path']
        const component = await fixture<TestComponent>(html`<reactive-path .paths=${paths}></reactive-path>`)
        const form = querySelectorDeep('mb-form') as MbForm
        expect(Object.keys(form.mbElements)).to.eql(["hello/there", "another/path"])
        component.paths = ['hello/there']
        await elementUpdated(component)
        expect(Object.keys(form.mbElements)).to.eql(['hello/there'])
    })


    it('should remove children elements properly', async () => {
        const component = await fixture<RepeateableTest>(html`<repeat-element></repeat-element>`)
        const form = querySelectorDeep('mb-form') as MbForm
        expect(Object.keys(form.data).length).to.eql(2)
        component.i = 1
        await elementUpdated(component)
        expect(Object.keys(form.data).length).to.eql(1)
    })

    it('should remove children elements properly in nested div', async () => {
        const component = await fixture<RepeateableTest2>(html`<repeat-element2></repeat-element2>`)
        const form = querySelectorDeep('mb-form') as MbForm
        expect(Object.keys(form.data).length).to.eql(2)
        component.i = 1
        await elementUpdated(component)
        expect(Object.keys(form.data).length).to.eql(1)
    })

})