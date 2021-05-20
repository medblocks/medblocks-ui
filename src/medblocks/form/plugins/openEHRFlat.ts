import { MbPlugin } from './plugins';
import { unflatten } from '../utils';
import { Data } from '../utils';

export interface Ctx {
  time?: string;
  language?: string;
  territory?: string;
  composer_name?: string;
}

function defaultContextData(path: string, ctx: Ctx = {}): any {
  const parts = path.split('/');
  const contextId = parts[parts.length - 1];
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
        console.warn(
          "Please set composer_name field on ctx property. Setting 'Medblocks UI' for now."
        );
        return {
          name: 'Medblocks UI',
        };
      }
    default:
      console.warn(`[${path}]: Unprocessed context`);
      return;
  }
}

function toFlat(data: Data): Data {
  const flat: any = {};
  Object.keys(data).forEach(path => {
    const value = data[path];
    if (typeof value === 'object') {
      Object.keys(value).forEach(frag => {
        flat[`${path}|${frag}`] = value[frag];
      });
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

  getContext: defaultContextData,
};
