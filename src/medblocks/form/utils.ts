export interface Data {
  [path: string]: any;
}
export let flatten = (function (isArray, wrapped) {
  return function (table: any) {
    return reduce('', {}, table);
  };

  function reduce(path: string, accumulator: any, table: any) {
    if (isArray(table)) {
      var length = table.length;

      if (length) {
        var index = 0;

        while (index < length) {
          var property = path + '[' + index + ']',
            item = table[index++];
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      } else accumulator[path] = table;
    } else {
      var empty = true;

      if (path) {
        for (var property in table) {
          var item = table[property],
            property = path + '.' + property,
            empty = false;
          if (wrapped(item) !== item) accumulator[property] = item;
          else reduce(property, accumulator, item);
        }
      } else {
        for (var property in table) {
          var item = table[property],
            empty = false;
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
  var result: any = {};

  for (var path in table) {
    var cursor = result,
      length = path.length,
      property = '',
      index = 0;

    while (index < length) {
      var char = path.charAt(index);

      if (char === '[') {
        var start = index + 1,
          end = path.indexOf(']', start),
          cursor = (cursor[property] = cursor[property] || []),
          property = path.slice(start, end),
          index = end + 1;
      } else {
        var cursor = (cursor[property] = cursor[property] || {}),
          start = char === '.' ? index + 1 : index,
          bracket = path.indexOf('[', start),
          dot = path.indexOf('.', start);

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

