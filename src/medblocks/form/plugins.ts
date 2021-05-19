import { AxiosInstance, AxiosResponse } from 'axios';
import EhrElement from '../EhrElement';

/*
 * On submit, `getContext` for all empty context first runs, then the `export` runs. 
 * The output of the export is emitted in the `submit` event as the detail.
 * Other methods like get, post, put, delete and import are exposed as part of the form interface, but are not triggered without the user manually using them.
 */
export interface MbPlugin {
  /**The default function to get the current form resource from a server. Expected to be passed through import before setting as the data. */
  get(cdr: AxiosInstance, uid: string): Promise<AxiosResponse<any>>;
  /**The default function to post the resource to a server. The data parameter must be the detail of mb-submit, or be serialized using the `export` method manually. */
  post(cdr: AxiosInstance, data: any): Promise<AxiosResponse<any>>;
  
  put?(cdr: AxiosInstance, uid: string, data: any): Promise<AxiosResponse<any>>;
  delete?(cdr: AxiosInstance, data: any): Promise<AxiosResponse<any>>;
  
  /**Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource.*/
  export(mbElements: {[path: string]: EhrElement}): any;
  /**Parse output format to internal representation. */
  import(data: any): any;
  /**Handle an empty mb-context given a ctx object. */
  getContext(path: string, ctx: any): any;
}