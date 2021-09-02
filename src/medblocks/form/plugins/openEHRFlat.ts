import { MbPlugin } from './plugins';
import { unflatten } from '../utils';
import { Data } from '../utils';

export interface Ctx {
  time?: string;
  language?: string;
  territory?: string;
  composer_name?: string;
}

function toFlat(data: Data): Data {
  const flat: any = {};
  Object.keys(data).forEach(path => {
    const value = data[path];           
    if (typeof value === 'object') {
      if(Array.isArray(value)){
        value.forEach((val,i) => {
          flat[`${path}:${i}`] = val;
        });
      }else{
        Object.keys(value).forEach(frag => {
          flat[`${path}|${frag}`] = value[frag];
        });
      }
      
    } else {
      flat[path] = value;
    }
  });
  return flat;
}

function fromFlat(flat: Data): Data {
  let data: Data = {};
  Object.keys(flat).map(path => {
    const value = flat[path];
    const [subpath, frag] = path.split('|');
    if (frag) {
      data[subpath] = { ...data[subpath], [frag]: value };
    } else {
      data[subpath] = value;
    }
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
  parse(_, data) {
    return fromFlat(data);
  },

  serialize(mbElements) {
    let data: { [path: string]: any } = {};
    Object.entries(mbElements).map(([path, node]) => {
      data[path] = (node as any).data;
    });
    return toFlat(data);
  },

  getContext(path, ctx = {}, nonNullPaths) {
    if (!toInsertContext(path, nonNullPaths)) {
      return;
    }

    let parts = path.split('/');
    const contextId = parts[parts.length - 1];

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
        }
      default:
        return;
    }
  },
};
