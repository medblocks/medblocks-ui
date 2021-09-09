import { SlInput } from "@shoelace-style/shoelace";
import { customElement, property, html, state } from "lit-element";
import EhrElement from "../EhrElement";

@customElement('mb-input-multiple')
export default class MbInputMultiple extends EhrElement {
    @property({ type: Array }) data: string[] = []

    @state() value: string = ''

    handleClear(tag: string) {
        this.data = this.data.filter(string => string !== tag)
        this._mbInput.emit();
    }

    handleInput(e: CustomEvent) {
        const target = e.target as SlInput;
        this.value = target.value
    }

    addValue() {
        this.data = [...this.data, this.value]
        this.value = ''
        this._mbInput.emit();
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.addValue()
            }
        })
    }
    render() {
        return html`
        <div>
            <sl-input help-text="Press enter to add another" @sl-input=${this.handleInput} label=${this.label || '' } .value=${this.value}>
                <sl-icon @click=${this.addValue} library="medblocks" name="plus-square-fill" slot="suffix"></sl-icon>
                </sl-icon>
            </sl-input>
            <div>
                ${this.data.map(s => html`<sl-tag size="medium" @sl-clear=${() => this.handleClear(s)} clearable>${s}</sl-tag>`)}
            </div>
        </div>
        `
    }
}