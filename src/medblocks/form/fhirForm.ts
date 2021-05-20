import { customElement } from 'lit-element';
import { FHIRPlugin } from './plugins/fhir';
import Form from './form'

@customElement('mb-fhir-form')
export default class FHIRForm extends Form {
    plugin = FHIRPlugin
}