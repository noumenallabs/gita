const fs = require('fs');

function patchFunction(obj, name) {
  const original = obj[name];
  if (!original) return;
  obj[name] = function(...args) {
    try {
      return original.apply(this, args);
    } catch (err) {
      if (err && err.code === 'EPERM') {
        err.code = 'ENOENT';
      }
      throw err;
    }
  };
}

function patchFunctionAsync(obj, name) {
  const original = obj[name];
  if (!original) return;
  obj[name] = function(...args) {
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      const newArgs = args.slice(0, -1);
      newArgs.push((err, ...res) => {
        if (err && err.code === 'EPERM') {
          err.code = 'ENOENT';
        }
        callback(err, ...res);
      });
      return original.apply(this, newArgs);
    }
    return original.apply(this, args);
  };
}

// Patch sync functions
patchFunction(fs, 'statSync');
patchFunction(fs, 'lstatSync');
patchFunction(fs, 'readFileSync');
patchFunction(fs, 'readdirSync');
patchFunction(fs, 'accessSync');

// Patch async functions
patchFunctionAsync(fs, 'stat');
patchFunctionAsync(fs, 'lstat');
patchFunctionAsync(fs, 'readFile');
patchFunctionAsync(fs, 'readdir');
patchFunctionAsync(fs, 'access');

// Patch promises if they exist
if (fs.promises) {
  const patchPromise = (obj) => {
    const patchField = (name) => {
      const original = obj[name];
      if (!original) return;
      obj[name] = async function(...args) {
        try {
          return await original.apply(this, args);
        } catch (err) {
          if (err && err.code === 'EPERM') {
            err.code = 'ENOENT';
          }
          throw err;
        }
      };
    };
    patchField('stat');
    patchField('lstat');
    patchField('readFile');
    patchField('readdir');
    patchField('access');
  };
  patchPromise(fs.promises);
}

try {
  const fsp = require('fs/promises');
  if (fsp) {
    const patchPromise = (obj) => {
      const patchField = (name) => {
        const original = obj[name];
        if (!original) return;
        obj[name] = async function(...args) {
          try {
            return await original.apply(this, args);
          } catch (err) {
            if (err && err.code === 'EPERM') {
              err.code = 'ENOENT';
            }
            throw err;
          }
        };
      };
      patchField('stat');
      patchField('lstat');
      patchField('readFile');
      patchField('readdir');
      patchField('access');
    };
    patchPromise(fsp);
  }
} catch (e) {}

console.log('FS Monkey Patch Loaded (EPERM -> ENOENT)');
