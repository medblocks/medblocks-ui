import {
    html,
    fixture,
    expect,
    oneEvent,
} from '@open-wc/testing';
import MbSubmit from '../src/medblocks/submit/submit';
import { querySelectorDeep } from 'query-selector-shadow-dom'

import '../medblocks'

describe('Submit', () => {
    it('should emit mb-trigger-submit event with normal button', async () => {
        const submit = await fixture<MbSubmit>(
            html`
            <mb-submit>
                <button>Click me!</button>
            </mb-submit>
            `
        )
        const button = querySelectorDeep('button')
        setTimeout(() => {
            button?.click()
        })
        const e = await oneEvent(submit, 'mb-trigger-submit')
        expect(e).to.not.be.undefined
    })
    it('should emit mb-trigger-submit event with sl-button', async () => {
        const submit = await fixture<MbSubmit>(
            html`
            <mb-submit>
                <sl-button>Click me!</sl-button>
            </mb-submit>
            `
        )
        const button = querySelectorDeep('button')
        setTimeout(() => {
            button?.click()
        })
        const e = await oneEvent(submit, 'mb-trigger-submit')
        expect(e).to.not.be.undefined
    })
})