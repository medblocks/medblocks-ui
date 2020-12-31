import {fireEvent, render} from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import Write from "../src/rm/Text/TextWrite.svelte"
import '@testing-library/jest-dom/extend-expect'
import { tick } from "svelte"

describe("Text: Write component", ()=>{
    it('must render normally', ()=>{
        let store = writable({})
        const component = render(Write, {props: {path: 'this/is/a/sample/path', store, name: "Sample name"}})
        expect(component.getByText("Sample name").innerHTML).toEqual('Sample name')
    })

    it('must render without label', async ()=>{
        let store = writable({})
        const component = render(Write, {props: {path: 'this/is/a/sample/path', store, name: "Sample name", displayLabel: false}})
        expect(()=>component.getByText("Sample name")).toThrow()
    })

    it('must react to input change', async ()=>{
        let store = writable({})
        const path = 'this/is/a/sample/path'
        const component = render(Write, {props: {path, store, name: "Sample name", defaultValue: "hello there"}})
        let input = component.getByLabelText("Sample name")
        await fireEvent.input(input, {target: {value: "Hello world"}})
        expect(get(store)[path]).toEqual("Hello world")
        expect(()=>component.getByDisplayValue("Hello world")).not.toThrow()
    })

    it('must trigger change with displayFunction', async ()=>{
        let store = writable({})
        const path = 'this/is/another/path'
        const displayFunctionString = `(store)=>{
            if(store["1"]){
                return true
            } else {
                return false
            }
        }`
        const displayFunction = Function("return " + displayFunctionString)()
        const component = render(Write, {props: {path, store, name: "Sample name", defaultValue: "hello there", displayFunction}})
        expect(()=>component.getByText("Sample name")).toThrow()
        store.update(s=>({...s, "1": "Just saying hi"}))
        await tick()
        expect(()=>component.getByText("Sample name")).not.toThrow()
    })

    it('must render from computeFunction', async ()=>{
        const computeFunction = (store)=>{
            if (store["a"] && store["b"]) {
                return store["a"] + store["b"]
            } else {
                return
            }
        }
    })
})