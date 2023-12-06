import { customElement, html, property } from 'lit-element';
// import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import { AxiosInstance } from 'axios';
import { supabaseStoragePlugin } from './mediaFunction';
import EhrElement from '../EhrElement';

@customElement('mb-multimedia')
export default class MbMultimedia extends EhrElement {
  @property({ type: Object }) data:
    | {
        _root: string;
        mediatype: string | undefined;
        alternatetext: string | undefined;
        size: number | undefined;
      }
    | undefined = undefined;

  @property({ type: String }) src: string;

  @property({ type: String }) label: string = '';

  @property({ type: String }) parentAxiosKey: string = 'storage-api';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  @property({ type: Object }) axios: AxiosInstance;

  @property({ type: Object }) plugin = {
    storageAPI: supabaseStoragePlugin,
  };

  get _parentAxios(): AxiosInstance {
    const dependencyEvent = this._mbDependency.emit({
      detail: { key: this.parentAxiosKey },
    });
    return dependencyEvent.detail.value;
  }

  async _handleChange(e: any) {
    const axios = this.axios ? this.axios : this._parentAxios;
    const element = e.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      this.loading = true;
      const output = await this.plugin.storageAPI.upload({ axios, file });

      if (e.target?.value === '') {
        this.data = undefined;
      } else {
        this.data = {
          _root: `s3:///${output}`,
          mediatype: file?.type,
          alternatetext: file?.name,
          size: file?.size,
        };
        this.handleInput();
      }
      this.loading = false;
    }

    this._mbInput.emit();
  }

  async handleInput() {
    const axios = this.axios ? this.axios : this._parentAxios;
    const downloadedFile = await this.plugin.storageAPI.download({
      axios,
      key: this.data?._root.split('///')[1],
    });
    this.src = URL.createObjectURL(downloadedFile);
  }

  render() {
    return html`
      <p>
        <input
          type="file"
          accept="image/*"
          name="image"
          id="file"
          label=${this.label}
          @change=${this._handleChange}
        />
      </p>
      ${this.loading
        ? html` <p>
            <img
              alt=""
              width="200"
              src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            />
          </p>`
        : html` <p><img alt="" width="200" src=${this.src || ''} /></p> `}
    `;
  }
}

export interface MbMultimediaInputEvent extends CustomEvent {
  target: MbMultimedia;
}
