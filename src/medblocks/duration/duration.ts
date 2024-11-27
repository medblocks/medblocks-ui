import { customElement, html, property, state, css } from 'lit-element';
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import EhrElement from '../EhrElement';

@customElement('mb-duration')
export default class MbDuration extends EhrElement {
  static styles = css`
    .duration {
      display: flex;
      gap: 10px;
    }
    .label {
      font-size: var(--sl-input-label-font-size-medium);
      display: inline-block;
      color: var(--sl-input-label-color);
      margin-bottom: var(--sl-spacing-xxx-small);
    }
    .label-s {
      font-size: var(--sl-input-label-font-size-small);
      display: inline-block;
      color: var(--sl-input-label-color);
      margin-bottom: var(--sl-spacing-xxx-small);
    }
    sl-input {
      width: 0;
      flex: 1 1 auto;
    }

    .print-only {
      display: none;
    }

    @media print {
      .print-only {
        display: inline-block;
        margin: 0px;
        padding: 2px;
      }
      .label {
        display: none;
      }
      .label-s {
        display: none;
      }
      .duration {
        display: none;
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) year = false;

  @property({ type: Boolean, reflect: true }) month = false;

  @property({ type: Boolean, reflect: true }) week = false;

  @property({ type: Boolean, reflect: true }) day = false;

  @property({ type: Boolean, reflect: true }) hour = false;

  @property({ type: Boolean, reflect: true }) minute = false;

  @property({ type: Boolean, reflect: true }) second = false;

  @property({ type: Boolean, reflect: true }) required = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: Boolean, reflect: true }) hidelabel = false;

  @property({ type: String, reflect: true }) min = '1';

  @property({ type: String, reflect: true }) placeholder = '';

  @property({ type: String, reflect: true }) id = 'duration';

  @state() _state: { [period: string]: string | undefined } = {};

  parsePeriod(period: string | undefined) {
    if (period) {
      const [periodPart, t] = period.split('T');
      const p = periodPart.replace('P', '');
      this._state.year = this.getPart(p, 'Y');
      this._state.month = this.getPart(p, 'M');
      this._state.week = this.getPart(p, 'W');
      this._state.day = this.getPart(p, 'D');
      if (t) {
        this._state.hour = this.getPart(t, 'H');
        this._state.minute = this.getPart(t, 'M');
        this._state.second = this.getPart(t, 'S');
      }
    }
  }

  getPart(periodPart: string, part: string): string | undefined {
    const myRegexp = new RegExp(`(\\d+)${part}`, 'g');
    const match = myRegexp.exec(periodPart);
    return match ? match[1] : undefined;
  }

  serializePeriod(): string | undefined {
    const hour = this._state.hour ? `${this._state.hour}H` : '';
    const minute = this._state.minute ? `${this._state.minute}M` : '';
    const second = this._state.second ? `${this._state.second}S` : '';
    const t = [hour, minute, second].join('');

    const year = this._state.year ? `${this._state.year}Y` : '';
    const month = this._state.month ? `${this._state.month}M` : '';
    const week = this._state.week ? `${this._state.week}W` : '';
    const day = this._state.day ? `${this._state.day}D` : '';
    const p = [year, month, week, day].join('');

    const timePart = t ? `T${t}` : '';
    const periodPart = p ? `P${p}` : '';
    if (!periodPart && !timePart) return undefined;
    if (!periodPart && timePart) return `P${timePart}`;
    return `${periodPart}${timePart}`;
  }

  get data(): string | undefined {
    return this.serializePeriod();
  }

  set data(period: string | undefined) {
    const oldVal = this.data;
    this.parsePeriod(period);
    this.requestUpdate('data', oldVal);
  }

  handleInput(value: string, e: CustomEvent) {
    const oldVal = this.data;
    const target = e.target as SlInput;
    this._state = { ...this._state, [value]: target.value };
    this.requestUpdate('data', oldVal);
    this._mbInput.emit();
  }

  formatDuration(value: string): string {
    return `${value.charAt(0).toUpperCase() + value.slice(1)}s`;
  }

  reportValidity() {
    const input = this.shadowRoot?.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  getInputs() {
    const allDurations: any = {
      year: this.year,
      month: this.month,
      week: this.week,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
    };
    const durationKeys = Object.keys(allDurations);
    const toRender = durationKeys.every(a => allDurations[a] === false)
      ? durationKeys
      : durationKeys.filter(a => allDurations[a]);

    return toRender.map(
      a => html`<sl-input
        .disabled=${this.disabled}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        id=${`${this.id}-${this.formatDuration(a)}`}
        type="number"
        .min=${this.min}
        ?required=${this.required}
        placeholder=${this.placeholder}
        help-text=${this.hidelabel ? '' : this.formatDuration(a)}
        .value=${this._state[a] || ''}
        @sl-input=${(e: CustomEvent) => this.handleInput(a, e)}
      ></sl-input>`
    );
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <div style="display:flex">
          <p>${this._state.day ? this._state.day : '-'}</p>
        </div>
      </div>`;
    }
    return html`
      ${this.label
        ? html`<label
            part="label"
            class=${this.variant === 'small' ? 'label-s' : 'label'}
            >${this.label}</label
          >`
        : null}
      <div class="duration">${this.getInputs()}</div>
      <p class="print-only">${this._state.day || '-'}</p>
    `;
  }
}
