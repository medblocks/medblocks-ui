import {render, screen} from "@testing-library/svelte"
import Form from "../src/form/Form.svelte"
import {writable} from "svelte/store"
import json from "../templates/better/physicalActivity.json"
import activity from "../templates/better/EHRN Activity summary.v1.json"
import adverseReaction from "../templates/better/EHRN Adverse reactions.v0.json"
import anthropometry from "../templates/better/EHRN Anthropometry.v2.json"
describe("jest a test", ()=>{
    it('must render a component', ()=>{
        const component = render(Form, {store: writable({}), template: json})
        let title = component.getByText("Physical Activity")
    })
})

describe("new components", ()=>{
    it('must render DV_QUANTITY rmType', ()=>{
        const component = render(Form, {store: writable({}), template: activity})
        expect(()=>component.getAllByText("Type DV_QUANTITY not yet implimented at")).toThrow()

    })
    it('must render DV_DATE_TIME rmType', ()=>{
        const component = render(Form, {store: writable({}), template: activity})
        expect(()=>component.getAllByText("Type DV_DATE_TIME not yet implimented at")).toThrow()
    })
    it('must render DV_COUNT rmType', ()=>{
        const component = render(Form, {store: writable({}), template: activity})
        expect(()=>component.getAllByText("Type DV_COUNT not yet implimented at")).toThrow()
    })
    it('must render DV_DURATION rmType', ()=>{
        const component = render(Form, {store: writable({}), template: adverseReaction})
        expect(()=>component.getAllByText("Type DV_DURATION not yet implimented at")).toThrow()
    })
    it('must render DV_EHR_URI rmType', ()=>{
        const component = render(Form, {store: writable({}), template: adverseReaction})
        expect(()=>component.getAllByText("Type DV_EHR_URI not yet implimented at")).toThrow()
    })
    it('must render DV_URI rmType', ()=>{
        const component = render(Form, {store: writable({}), template: adverseReaction})
        expect(()=>component.getAllByText("Type DV_URI not yet implimented at")).toThrow()
    })
    it('must render DV_PROPORTION rmType', ()=>{
        const component = render(Form, {store: writable({}), template: anthropometry})
        expect(()=>component.getAllByText("Type DV_PROPORTION not yet implimented at")).toThrow()
    })
})