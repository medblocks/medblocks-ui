import '@testing-library/jest-dom'
import CodedText from "../../src/rm/CodedText/CodedTextWrite.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { rawTree } from "./webtemplate"
import { mockChanges } from "../utils"
import userEvent from '@testing-library/user-event'

describe('Basic Write - CodedText', () => {
    let ordinal: RenderResult
    let store: writableKeyValue
    let tree
    beforeEach(() => {
        tree = mockChanges(rawTree)
        store = writable({})
        const props = {
            tree,
            path: 'testing/path',
            store
        }
        ordinal = render(CodedText, { props })
    })
    it('must render all options', () => {
        const options = ordinal.getAllByRole("option")
        expect(options.map(option => option.textContent)).toEqual([
            'Select an option',
            'Present',
            'Not detected',
        ])
    })
    it('must select correct values', async () => {
        let select = ordinal.getByLabelText(tree.name)
        userEvent.tab()
        expect(select).toHaveFocus()
        userEvent.selectOptions(select, "at1024")
        await tick()
        expect(get(store)).toEqual({
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        })
    })

    it('it must display correct value', async () => {
        let select = ordinal.getByLabelText(tree.name)
        store.set({
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        })
        await tick()
        expect(select).toHaveTextContent('Present')
    })

    
})