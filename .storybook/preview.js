import { setCustomElements } from '@web/storybook-prebuilt/web-components.js'
import '../dist/medblocks.js'
import elements from '../dist/custom-elements.js'

setCustomElements(elements);

export const parameters = {
    actions: { argTypesRegex: "^mb-.*" },
    layout: 'padded',
    options: {
        storySort: {
            order: ['Introduction', 'Data Entry', ['Coded Text', ['Introduction']], 'Utility'],
        }
    }

}