import { MbPlugin } from './plugins';
import { unflatten } from '../utils';
import { Data } from '../utils';
import MbContext from '../../context/context';

export interface Ctx {
  time?: string;
  language?: string;
  territory?: string;
  composer_name?: string;
}

function multipleSelectArray(value:string[],path:string,flat:any){
   value.forEach((val,i)=>{
     if(typeof val==='object'){
       Object.keys(val).forEach(item=>{
         flat[`${path}:${i}|${item}`]=val[item]
       })
     }else{
       flat[`${path}:${i}`]=val
     }
     
   })
}
export function toFlat(data: Data): Data {
  const flat: any = {};
  Object.keys(data).forEach(path => {
    const value = data[path];           
    if (typeof value === 'object') {
      if(Array.isArray(value)){
        multipleSelectArray(value,path,flat)
      }else{
        Object.keys(value).forEach(frag => {
          if(frag!=='_root'){
            flat[`${path}|${frag}`] = value[frag];
          }else{
            flat[path]= value[frag];
          }
        });
      }
      
    } else {
      flat[path] = value;
    }
  });
  return flat;
}

export function fromFlat(flat: Data): Data {
  let data: Data = {};
  Object.keys(flat).map(path => {
    const value = flat[path];
    const [subpath, frag] = path.split('|');
    if (frag) {
      if(data[subpath] && typeof data[subpath] !== "object"){
        data[subpath] = { "_root": data[subpath] };
      }
      data[subpath] = { ...data[subpath], [frag]: value };
    } else {
      if(data[subpath]){
        data[subpath] = { ...data[subpath], "_root": value };
      }else{
        data[subpath] = value;  
      }
    }
    //   "ncd/pulse_oximetry/any_event:0/spo": 0.02,
    // "ncd/pulse_oximetry/any_event:0/spo|numerator": 2.0,
    // "ncd/pulse_oximetry/any_event:0/spo|denominator": 100.0,
    // "ncd/pulse_oximetry/any_event:0/spo|type": 2,
  });
  return data;
}


function formatPath(path: string) {
  return path
    .replace(/\//g, '.')
    .replace(/\|/g, '.')
    .replace(/:(\d)/g, (_: string, number: string) => `[${number}]`);
}

export function formatFlatComposition(flat: any) {
  let newComposition: any = {};
  Object.entries(flat).forEach(([path, value]) => {
    const formattedPath = formatPath(path);
    newComposition[formattedPath] = value;
  });
  return newComposition;
}

export function unflattenComposition(flat: any, path?: string) {
  if (!path) {
    return unflatten(formatFlatComposition(flat));
  }
  let newObject: any = {};
  const paths = Object.keys(flat).filter(p => p.includes(path));
  paths.forEach(p => {
    const newPath = p.replace(path, '');
    newObject[newPath] = flat[p];
  });
  return unflatten(formatFlatComposition(newObject));
}

function toInsertContext(path: string, nonNullPaths: string[]): boolean {
  const segments = path.split('/');
  // Root context Eg: template/language
  if (segments.length <= 2) {
    return true;
  }
  let previousPath: string;
  previousPath = segments.slice(0, -1).join('/');
  const previousSegment = segments[segments.length - 2];
  // Eg: context/start_time or context/setting
  if (previousSegment === 'context') {
    return true;
  }
  if (previousSegment === 'ism_transition') {
    previousPath = segments.slice(0, -2).join('/');
  }
  // Eg: templates/vitals/body_temperature/time will only return if some templates/vitals/body_temperature/* is defined
  if (nonNullPaths.some(p => p.startsWith(previousPath))) {
    return true;
  }

  return false;
}

export const openEHRFlatPlugin: MbPlugin = {
  parse(mbElements, data) {
    const parsedData = fromFlat(data);
    const mbElementsWithMultiple = Object.keys(mbElements).filter(path=>{
        const element = mbElements[path] as any;
        return element.multiple;
    })
    let pathWithMultiple:string[] = [];
    let dataWithMultiple:{[path:string]:any[]} = {}

    mbElementsWithMultiple.forEach(basePath=>{
      const elementsWithBasePath = Object.keys(parsedData).filter(path=>path.startsWith(basePath));
      const arrayOfValues = elementsWithBasePath.map(path=>parsedData[path]);
      dataWithMultiple = {...dataWithMultiple,[basePath]:arrayOfValues};
      pathWithMultiple = [...pathWithMultiple,...elementsWithBasePath];
    })
    pathWithMultiple.forEach(path=>{
      delete parsedData[path];
    })
    return {...parsedData,...dataWithMultiple}
  },

  serialize(mbElements) {
    let data: { [path: string]: any } = {};
    Object.entries(mbElements).map(([path, node]) => {
      data[path] = (node as any).data;
    });
    return JSON.parse(JSON.stringify(toFlat(data)));
  },

  getContext(path, ctx = {}, nonNullPaths,mbElements) {
    if (!toInsertContext(path, nonNullPaths)) {
      return;
    }

    let parts = path.split('/');
    const contextId = parts[parts.length - 1];
    let context = mbElements[path] as MbContext
    if(context.bind){
      return context.bind;
    }
    if (ctx[contextId] != null) {
      return ctx[contextId];
    }

    switch (contextId) {
      case 'start_time':
      case 'time':
        return ctx.time || new Date().toISOString();
      case 'category':
        return {
          code: '433',
          value: 'event',
          terminology: 'openehr',
        };
      case 'setting':
        return {
          code: '238',
          value: 'other care',
          terminology: 'openehr',
        };
      case 'language':
        return {
          code: ctx.language || 'en',
          terminology: 'ISO_639-1',
        };
      case 'territory':
        return {
          code: ctx.territory || 'IN',
          terminology: 'ISO_3166-1',
        };

      case 'encoding':
        return {
          code: 'UTF-8',
          terminology: 'IANA_character-sets',
        };
      case 'composer':
        if (ctx.composer_name) {
          return {
            name: ctx.composer_name,
          };
        } else {
          return {
            name: 'Medblocks UI',
          };
        };
      case '_health_care_facility':
        if(ctx._health_care_facility){
          return {
            name: ctx._health_care_facility,
            id:ctx._health_care_facility_id || 'Encounter ID',
            id_scheme: 'Encounter',
            id_namespace: 'FHIR'
          }
        }else{
          return {
            name: 'Medblocks Hospital',
            id:ctx._health_care_facility_id || 'Encounter ID',
            id_scheme: 'Encounter',
            id_namespace: 'FHIR'
          }
        }
      default:
        return;
    }
  },
};
