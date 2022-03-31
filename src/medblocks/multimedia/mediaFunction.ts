import { AxiosInstance } from 'axios';

export interface MediaOptions {
  axios: AxiosInstance;
  file: FormData;
}

export interface MediaResult {
  Key: string;
}
type URI = string;

export type MediaFunction = (options: MediaOptions) => Promise<MediaResult>;

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export interface StoragePlugin {
  upload(options: { file: File; axios: AxiosInstance }): Promise<URI>;
  download(options: { axios: AxiosInstance; key: URI|undefined }): Promise<File>;
}

export const supabaseStoragePlugin: StoragePlugin = {
  upload: async ({ axios, file }) => {
    const form = new FormData();
    form.append('data', file);
    const response = await axios.post(`/${create_UUID()}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const key = response.data.Key.split('/')[1];
    return key;
  },
  download: async ({ axios, key }) => {

    const response = await axios({
      url: `/${key}`,
      method: 'GET',
      responseType: 'blob',
    });
    let file = new File([response.data], "patientData");
    return file;
  },
};
