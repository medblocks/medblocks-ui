import { AxiosInstance, AxiosResponse } from 'axios';
import { defaultContextData, fromFlat, toFlat } from './openEHR';

export interface MbPlugin {
  get(cdr: AxiosInstance, uid: string): Promise<AxiosResponse<any>>;
  post(cdr: AxiosInstance, data: any): Promise<AxiosResponse<any>>;
  put?(cdr: AxiosInstance, uid: string, data: any): Promise<AxiosResponse<any>>;
  delete?(cdr: AxiosInstance, data: any): Promise<AxiosResponse<any>>;
  export(data: any): any;
  import(data: any): any;
  getContext(path: string, ctx: any): any;
}

export const openEHRPlugin: MbPlugin = {
  async get(cdr, uid) {
    const r = await cdr.get(`/composition/${uid}`, { params: { format: 'FLAT' } });
    return r;
  },

  async post(cdr, data) {
    const r = await cdr.post(`/composition`, data, {
      params: { format: 'FLAT' }
    });
    return r;
  },

  async put(cdr, uid, data) {
    const r = await cdr.put(`/composition/${uid}`, data, {
      params: { format: 'FLAT' }
    });
    return r;
  },

  import(data) {
    return fromFlat(data);
  },

  export(data) {
    return toFlat(data);
  },

  getContext: defaultContextData
};
