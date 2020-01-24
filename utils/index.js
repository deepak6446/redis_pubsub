/**
 * contains common functions to be used across modules
 */

module.exports = {
  wait: (func, context, ...args) => {
    return new Promise((resolve, reject) => {
      func
        .apply(context, args)
        .then(data => {
          return resolve([null, data]);
        })
        .catch(err => {
          return resolve([err, null]);
        });
    });
  }
};
