export class DebounceUtils {
  private static debounceCallbacks: {[key: string]: {callback: () => void; timeout: any}} = {};
  static debounce(key: string, ms: number, callback: () => void): any {
    if (DebounceUtils.debounceCallbacks[key]) {
      console.log(key + ' debounce stopped');
      clearTimeout(DebounceUtils.debounceCallbacks[key].timeout);
    }

    console.log(key + ' debounce started ' + ms);

    DebounceUtils.debounceCallbacks[key] = {
      callback,
      timeout: setTimeout(() => {
        console.log(key + ' debounce called ' + ms);
        callback();
        delete DebounceUtils.debounceCallbacks[key];
      }, ms),
    };
  }
}
