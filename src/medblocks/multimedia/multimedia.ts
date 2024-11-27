import { customElement, html, property } from 'lit-element';
// import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import { AxiosInstance } from 'axios';
import { supabaseStoragePlugin } from './mediaFunction';
import EhrElement from '../EhrElement';
import { watch } from '../../internal/decorators';

@customElement('mb-multimedia')
export default class MbMultimedia extends EhrElement {
  @property({ type: Object }) data:
    | {
        _root?: string | undefined;
        data?: string | undefined;
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

  @property({ type: Boolean, reflect: true }) base64: boolean = false;

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
    const element = e.target as HTMLInputElement;
    const file = element.files?.[0];
    if (e.target?.value === '') {
      this.data = undefined;
    } else if (file) {
      if (this.base64) {
        const reader = new FileReader();
        let base64Data = '';
        reader.onload = event => {
          base64Data = event.target?.result as string;
          this.data = {
            data: base64Data,
            mediatype: file?.type,
            alternatetext: file?.name,
            size: file?.size,
          };
        };
        reader.readAsDataURL(file);
      } else {
        const axios = this.axios ? this.axios : this._parentAxios;
        this.loading = true;
        const output = await this.plugin.storageAPI.upload({ axios, file });
        this.data = {
          _root: `s3:///${output}`,
          mediatype: file?.type,
          alternatetext: file?.name,
          size: file?.size,
        };

        this.handleInput();
        this.loading = false;
      }
    }

    this._mbInput.emit();
  }

  async handleInput() {
    this.loading = true;
    if (this.base64) {
      this.src = this.data?.data as string;
    } else {
      try {
        const axios = this.axios ? this.axios : this._parentAxios;
        const downloadedFile = await this.plugin.storageAPI.download({
          axios,
          key: this.data?._root?.split('///')[1],
        });
        this.src = downloadedFile;
      } catch (e) {
        this.src = '';
      }
    }
    this.loading = false;
  }

  @watch('data')
  getSrc() {
    this.handleInput();
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
      ${this.data?.alternatetext || ''}
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
