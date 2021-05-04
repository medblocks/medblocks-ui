import {customElement, html, LitElement, property} from 'lit-element'
// import '@shoelace-style/shoelace/dist/components/menu/menu'

@customElement('example-element')
export class ExampleComp extends LitElement {
    @property({type: String}) hello: string = 'Sid!'
    render(){
        return html`Hello there ${this.hello} <sl-button>Hello there</sl-button>
        <sl-input></sl-input>
        `
    }
}