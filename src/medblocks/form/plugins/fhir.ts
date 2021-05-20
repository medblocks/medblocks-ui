import { CodedTextElement } from '../../codedtext/CodedTextElement';
import EhrElement from '../../EhrElement';
import { MbPlugin } from './plugins';
import { flatten, unflatten } from '../utils';

const serialize = (mbElement: EhrElement) => {
  if (mbElement.type === 'CodableConcept') {
    const codable = mbElement as CodedTextElement;
    if (codable.data?.code) {
      return {
        text: codable.data?.value,
        coding: [
          {
            system: codable.data?.terminology,
            code: codable.data?.code,
            display: codable.data?.value,
          },
        ],
      };
    }
    return;
  } else if (mbElement.type === 'code') {
    const code = mbElement as CodedTextElement;
    if (code.data?.code) {
      return code.data?.code;
    }
    return;
  }
  return mbElement.data;
};

const deserialize = (mbElement: EhrElement, data: any) => {
  if (mbElement.type === 'CodableConcept') {
    const terminology = data?.coding?.[0].system;
    const code = data?.coding?.[0].code;
    const value = data?.coding?.[0].display;
    if (terminology || code || value) {
      return {
        terminology,
        code,
        value,
      };
    }
    return;
  } else if (mbElement.type === 'code') {
    const el = mbElement as CodedTextElement;
    const code = data;
    const terminology = el.terminology;
    if (terminology || code) {
      return {
        terminology,
        code,
      };
    }
    return;
  }
  return data;
};

const isEmpty = (value: any): boolean => {
  if (value == null) {
    return true;
  }
  if (
    value &&
    value?.constructor === Object &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
};

export const FHIRPlugin: MbPlugin = {
  serialize(mbElements) {
    let transformed: { [path: string]: any } = {};
    Object.keys(mbElements).forEach(path => {
      const value = mbElements[path];
      if (!isEmpty(value.data)) {
        transformed[path] = serialize(value);
      }
    });
    const filtered = JSON.parse(JSON.stringify(transformed));
    return unflatten(filtered);
    // return mbElements
  },

  parse(mbElements, data) {
    const flat = flatten(data);
    let newObj: any = {};
    Object.keys(mbElements).forEach(path => {
      const value = flat[path];
      if (value) {
        newObj[path] = deserialize(mbElements[path], value);
      } else {
        // For paths that contain objects, so eg: contact[0].relationship[0] will want to include contact[0].relationship[0].coding[0].code
        const includesPath = Object.keys(flat).filter(p => p.startsWith(path));
        let simplifiedObject: any = {};
        includesPath.forEach(p => {
          let simplifiedPath = p.replace(path, '');
          if (simplifiedPath.startsWith('.')) {
            simplifiedPath = simplifiedPath.replace('.', '');
          }
          simplifiedObject[simplifiedPath] = flat[p];
        });
        const simplifiedUnflattened = unflatten(simplifiedObject);
        newObj[path] = deserialize(mbElements[path], simplifiedUnflattened);
      }
    });
    return newObj;
  },

  getContext(path, ctx) {
    console.log({ path, ctx });
  },
};
