import '@testing-library/jest-dom'
import Leaf from "../../src/composition/Leaf.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { rawTree, withDefault, expandableList, searchComponent } from "./webtemplate"
import { mockChanges } from "../utils"
import userEvent from '@testing-library/user-event'

describe.each([
    ['Pulse - basic', rawTree, {
        options: ['Select an option', 'Present', 'Not detected'],
        toSelect: "at1024",
        storeMustBe: {
            'testing/path|terminology': 'local',
            'testing/path|code': 'at1024',
            'testing/path|value': 'Present'
        },
        displayMustBe: 'Present'
    }],
    ['Overall test status - expandableList', expandableList, {
        options: ["Select an option", "Registered", "Partial", "Preliminary", "Final", "Amended", "Corrected", "Appended", "Cancelled", "Entered in error"],
        toSelect: "at0115",
        storeMustBe: {
            'testing/path|terminology': 'local',
            'testing/path|code': 'at0115',
            'testing/path|value': 'Corrected'
        },
        displayMustBe: 'Corrected'
    }]
])('%s', (name, rawTree, result) => {
    let component: RenderResult
    let store: writableKeyValue
    let tree
    beforeEach(() => {
        tree = mockChanges(rawTree)
        store = writable({})
        const props = {
            tree,
            path: 'testing/path',
            store,
            readOnly: false,
            type: 'Leaf'
        }
        component = render(Leaf, { props })
    })
    it('must render essential visual elements', () => {
        const options = component.getAllByRole("option")
        expect(options.map(option => option.textContent)).toEqual(result.options)
    })
    it('must change store on input change', async () => {
        let select = component.getByLabelText(tree.name)
        userEvent.selectOptions(select, result.toSelect)
        await tick()
        expect(get(store)).toEqual(result.storeMustBe)
    })

    it('must display correct values from store', async () => {
        let select = component.getByLabelText(tree.name)
        store.set(result.storeMustBe)
        await tick()
        expect(select).toHaveTextContent(result.displayMustBe)
    })

    it('must remove all related paths on destroying the component', async () => {
        let select = component.getByLabelText(tree.name)
        userEvent.selectOptions(select, result.toSelect)
        await tick()
        expect(get(store)).toEqual(result.storeMustBe)
        component.unmount()
        expect(get(store)).toEqual({})
    })
})



describe('advance', () => {
    it('must render default value', async () => {
        const tree = mockChanges(withDefault)
        const store = writable({})
        const props = {
            tree,
            path: 'testing/path',
            store,
            readOnly: false,
            type: 'Leaf'
        }
        const component = render(Leaf, { props })
        await tick()
        expect(get(store)).toEqual({
            'testing/path|terminology': 'LOINC',
            'testing/path|code': '58410-2',
            'testing/path|value': 'CBC panel - Blood by Automated count'
        })
    })
    it('must render a search component', async () => {
        const tree = mockChanges(searchComponent)
        const store = writable({})
        const mockFn = jest.fn((term, constraint, url) => [
            {
                code: '1234',
                value: "some result",
                display: "Result display"
            },
            {
                code: '4321',
                value: "another result",
                display: "Another result display"
            }
        ])
        const props = {
            tree,
            path: 'testing/path',
            store,
            readOnly: false,
            type: 'Leaf',
            search: true,
            terminologyUrl: "someurl",
            constraint: "<1234",
            searchFunction: mockFn
        }
        const component = render(Leaf, { props })
        const searchBox = component.getByRole("searchbox")
        userEvent.type(searchBox, "hello there")
        expect(mockFn).toHaveBeenLastCalledWith("", "<1234", "someurl")
        await new Promise(resolve => setTimeout(() => {
            expect(mockFn).toHaveBeenLastCalledWith("hello there", "<1234", "someurl")
            resolve(true)
        }, 300))
        const searchResults = component.getAllByRole('link')
        expect(searchResults.map(a => a.textContent)).toEqual(['Result display', 'Another result display'])
        await userEvent.click(searchResults[0])
        expect(get(store)).toEqual({
            "testing/path|code": "1234",
            "testing/path|terminology": "SNOMED-CT",
            "testing/path|value": "some result",
        })
    })
})