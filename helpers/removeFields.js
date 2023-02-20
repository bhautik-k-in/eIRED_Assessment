const { excludeFields } = require("./excludeFields");

/**
 * Remove fields from response object
 * @param {*} obj
 * @param {*} keys
 * @param {*} defaultFields
 * @returns Modified response object
 */
exports.removeFields = (obj, keys, defaultFields = true) => {
    let isObject = false;
    if (!(obj instanceof Array)) isObject = true;
  
    obj = obj instanceof Array ? obj : [obj];
    keys = typeof keys === "string" ? [keys] : keys ?? [];

    if (defaultFields) keys = excludeFields(keys);
    keys = Object.keys(keys);

    obj.forEach(data => {
      keys.forEach(key => delete data[key] );
    });

    if (isObject) return obj[0];
    return obj;
  }