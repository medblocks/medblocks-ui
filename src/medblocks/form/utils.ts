import EhrElement from '../EhrElement';
import Repeatable from '../repeat/Repeatable';

export interface Data {
  [path: string]: any;
}

export const flatten = (function (isArray, wrapped) {
  function reduce(path: string, accumulator: any, table: any) {
    if (isArray(table)) {
      const { length } = table;

      if (length) {
        let index = 0;

        while (index < length) {
          const property = `${path}[${index}]`;
          const item = table[index++];
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      } else accumulator[path] = table;
    } else {
      let empty = true;

      if (path) {
        Object.keys(table).forEach(property => {
          const item = table[property];
          const newPath = `${path}.${property}`;
          empty = false;
          if (wrapped(item) !== item) accumulator[newPath] = item;
          else reduce(newPath, accumulator, item);
        });
      } else {
        Object.keys(table).forEach(property => {
          const item = table[property];
          empty = false;
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        });
      }

      if (empty) accumulator[path] = table;
    }

    return accumulator;
  }
  return function (table: any) {
    return reduce('', {}, table);
  };
})(Array.isArray, Object);

export function unflatten(table: any) {
  const result: any = {};

  Object.keys(table).forEach(path => {
    const { length } = path;
    let cursor = result;
    let property = '';
    let index = 0;

    while (index < length) {
      const char = path.charAt(index);

      if (char === '[') {
        cursor[property] = cursor[property] || [];
        cursor = cursor[property];
        const start = index + 1;
        const end = path.indexOf(']', start);
        property = path.slice(start, end);
        index = end + 1;
      } else {
        cursor[property] = cursor[property] || {};
        cursor = cursor[property];
        const start = char === '.' ? index + 1 : index;
        const bracket = path.indexOf('[', start);
        const dot = path.indexOf('.', start);

        let end;
        if (bracket < 0 && dot < 0) {
          end = length;
          index = length;
        } else if (bracket < 0) {
          end = dot;
          index = dot;
        } else if (dot < 0) {
          end = bracket;
          index = bracket;
        } else {
          end = bracket < dot ? bracket : dot;
          index = bracket < dot ? bracket : dot;
        }
        property = path.slice(start, end);
      }
    }

    cursor[property] = table[path];
  });

  return result[''];
}

/** Takes a list of mutation records from MutationObserver and calculates the paths of EhrElements and Repeatables that were removed. */
export const getDeletedPaths = (records: MutationRecord[]) => {
  const ehrElementsRemoved: string[] = [];
  const repeatablesRemoved: string[] = [];
  records.forEach(record => {
    if (record.removedNodes.length > 0) {
      record.removedNodes.forEach((node: EhrElement & Repeatable) => {
        if (node.isMbElement) {
          ehrElementsRemoved.push(node.path);
        } else if (node.isRepeatable) {
          repeatablesRemoved.push(node.path);
        } else if (node.nodeType === node.ELEMENT_NODE) {
          const allNodes = node.querySelectorAll('*'); // DOM queries are slow. There's scope to optimize.
          allNodes.forEach((nod: EhrElement & Repeatable) => {
            if (nod.isMbElement) {
              ehrElementsRemoved.push(nod.path);
            } else if (nod.isRepeatable) {
              repeatablesRemoved.push(nod.path);
            }
          });
        }
      });
    }
  });
  return { ehrElementsRemoved, repeatablesRemoved };
};
