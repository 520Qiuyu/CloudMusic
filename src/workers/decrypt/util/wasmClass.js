import { isPromise } from 'radash';

export function withWasmClass(instance, cb) {
  let isAsync = false;
  try {
    const resp = cb(instance);
    if (resp && isPromise(resp)) {
      isAsync = true;
      resp.finally(() => instance.free());
    }
    return resp;
  } finally {
    if (!isAsync) {
      instance.free();
    }
  }
}