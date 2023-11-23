import EhrElement from '../EhrElement';
import Repeatable from '../repeat/Repeatable';

export interface Data {
  [path: string]: any;
}
export const flatten = (function (isArray, wrapped) {
  return function (table: any) {
    return reduce('', {}, table);
  };

  function reduce(path: string, accumulator: any, table: any) {
    if (isArray(table)) {
      const {length} = table;

      if (length) {
        let index = 0;

        while (index < length) {
          var property = `${path  }[${  index  }]`;
            var item = table[index++];
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      } else accumulator[path] = table;
    } else {
      var empty = true;

      if (path) {
        for (var property in table) {
          var item = table[property];
            var property = `${path  }.${  property}`;
            var empty = false;
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      } else {
        for (var property in table) {
          var item = table[property];
            var empty = false;
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      }

      if (empty) accumulator[path] = table;
    }

    return accumulator;
  }
})(Array.isArray, Object);

export function unflatten(table: any) {
  const result: any = {};

  for (const path in table) {
    var cursor = result;
      const {length} = path;
      var property = '';
      var index = 0;

    while (index < length) {
      const char = path.charAt(index);

      if (char === '[') {
        var start = index + 1;
          var end = path.indexOf(']', start);
          var cursor = (cursor[property] = cursor[property] || []);
          var property = path.slice(start, end);
          var index = end + 1;
      } else {
        var cursor = (cursor[property] = cursor[property] || {});
          var start = char === '.' ? index + 1 : index;
          const bracket = path.indexOf('[', start);
          const dot = path.indexOf('.', start);

        if (bracket < 0 && dot < 0) var end = (index = length);
        else if (bracket < 0) var end = (index = dot);
        else if (dot < 0) var end = (index = bracket);
        else var end = (index = bracket < dot ? bracket : dot);

        var property = path.slice(start, end);
      }
    }

    cursor[property] = table[path];
  }

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
            allNodes.forEach((node: EhrElement & Repeatable) => {
              if (node.isMbElement) {
                ehrElementsRemoved.push(node.path);
              } else if (node.isRepeatable) {
                repeatablesRemoved.push(node.path);
              }
            });
          }
      });
    }
  });
  return { ehrElementsRemoved, repeatablesRemoved };
};
