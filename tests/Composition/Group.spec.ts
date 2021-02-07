import '@testing-library/jest-dom'
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import Composition from "../../src/composition/Composition.svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { groupMultiplePaths, infiniteRepeatLoopTemplate, webtemplate } from "./webtemplate"
import userEvent from '@testing-library/user-event'

describe('Time depandant', ()=>{
    it('should not cause an infinite loop', async (done)=>{
        const store = writable({})
        const props = {
            template: infiniteRepeatLoopTemplate,
            configuration: {},
            readOnly: false,
            store
        }
        const component = render(Composition, props)
        const increaseButton = component.getAllByRole('button')[0]
        const toExec = ()=>{
            setTimeout(()=>{throw new Error('Promise timed out')}, 5000)
            userEvent.click(increaseButton)
            done()
        }
        expect(toExec).not.toThrow()
    })
})