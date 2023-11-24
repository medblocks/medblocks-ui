import EhrElement from '../../EhrElement';

/*
 * On submit, `getContext` for all empty context first runs, then the `export` runs.
 * The output of the export is emitted in the `submit` event as the detail.
 * Other methods like get, post, put, delete and import are exposed as part of the form interface, but are not triggered without the user manually using them.
 */
export interface MbPlugin {
  /** Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource. */
  serialize(mbElements: { [path: string]: EhrElement }): any;
  /** Parse output format to internal representation. */
  parse(mbElements: { [path: string]: EhrElement }, data: any): any;
  /** Handle an empty mb-context given a ctx object. */
  getContext(
    path: string,
    ctx: any,
    nonNullPaths: string[],
    mbElements: { [path: string]: EhrElement }
  ): any;
}
