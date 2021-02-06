import '@testing-library/jest-dom'
import Composition from "../../src/composition/Composition.svelte"
import { fireEvent, render, RenderResult } from "@testing-library/svelte"
import { get, writable } from "svelte/store"
import type { writableKeyValue } from "../../src/types/types"
import { tick } from "svelte"
import { groupMultiplePaths, webtemplate } from "./webtemplate"
import userEvent from '@testing-library/user-event'

describe('it should render a component', () => {
    it('should not have any unimplemented types', () => {
        const props = {
            template: webtemplate,
            configuration: {},
            readOnly: false
        }
        const composition = render(Composition, { props })
        expect(() => composition.getAllByText(/not yet implemented/)).toThrow()
    })
})

describe('Specific webtemplates', () => {
    beforeEach(() => {
        // (global.Date.prototype.toISOString as any) = jest.fn(() => 'MOCKDATE')
        jest.useFakeTimers('modern');
        jest.setSystemTime(Date.parse('2020-11-18T00:00:00Z'));
    })
    afterEach(() => {
        // global.Date = OriginalDate
        jest.useRealTimers();

    })
    it('it should render paths in repeatable properly', async () => {
        const store = writable({})
        const props = {
            template: groupMultiplePaths,
            configuration: {},
            readOnly: false,
            store
        }
        const composition = render(Composition, { props })
        const inputs = composition.getAllByRole('spinbutton')
        await userEvent.type(inputs[0], '123')
        await userEvent.type(inputs[1], '23')
        expect(get(store)).toEqual({
            'medblocks_ui.cbc_report.v0/laboratory_test_result/test_name|code': '58410-2',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/test_name|value': 'CBC panel - Blood by Automated count',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/test_name|terminology': 'LOINC',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/hb/analyte_name|code': '718-7',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/hb/analyte_name|value': 'Hemoglobin [Mass/volume] in Blood',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/hb/analyte_name|terminology': 'LOINC',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/wbc/analyte_name|code': '6690-2',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/wbc/analyte_name|value': 'Leukocytes [#/volume] in Blood by Automated count',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/wbc/analyte_name|terminology': 'LOINC',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/time': '2020-11-18T00:00:00.000Z',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/language|code': 'en',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/language|terminology': 'ISO_639-1',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/encoding|code': 'UTF-8',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/encoding|terminology': 'IANA_character-sets',
            'medblocks_ui.cbc_report.v0/context/start_time': '2020-11-18T00:00:00.000Z',
            'medblocks_ui.cbc_report.v0/context/setting|code': '238',
            'medblocks_ui.cbc_report.v0/context/setting|value': 'Other Care',
            'medblocks_ui.cbc_report.v0/context/setting|terminology': 'openehr',
            'medblocks_ui.cbc_report.v0/category|code': '433',
            'medblocks_ui.cbc_report.v0/category|value': 'event',
            'medblocks_ui.cbc_report.v0/category|terminology': 'openehr',
            'medblocks_ui.cbc_report.v0/language|code': 'en',
            'medblocks_ui.cbc_report.v0/language|terminology': 'ISO_639-1',
            'medblocks_ui.cbc_report.v0/territory|code': 'IN',
            'medblocks_ui.cbc_report.v0/territory|terminology': 'ISO_3166-1',
            'medblocks_ui.cbc_report.v0/composer|name': 'Sidharth Ramesh',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/hb/analyte_result:0|magnitude': 123,
            'medblocks_ui.cbc_report.v0/laboratory_test_result/hb/analyte_result:0|unit': 'g/100ml',
            'medblocks_ui.cbc_report.v0/laboratory_test_result/wbc/analyte_result:0|magnitude': 23,
            'medblocks_ui.cbc_report.v0/laboratory_test_result/wbc/analyte_result:0|unit': '10*3/uL'
        })
    })
})