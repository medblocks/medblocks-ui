import { render } from "@testing-library/svelte"
import Composition from "../../src/composition/Composition.svelte"
import { webtemplate } from "./webtemplate"

describe('it should render a component', () => {
    it('should not have any unimplemented types', () => {
        const props = {
            template: webtemplate,
            configuration: {},
            readOnly: false
        }
        const composition = render(Composition, { props })
        const selects = composition.getAllByText(/not yet implemented/)
        expect(selects.length).toEqual(0)
    })
})