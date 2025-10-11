const getBrowserAPI = () => {
  const isBrowser = typeof globalThis !== 'undefined' && globalThis.window;
  
  return {
    window: isBrowser ? globalThis.window : null,
    navigator: isBrowser ? globalThis.navigator : null,
    localStorage: isBrowser ? globalThis.localStorage : null,
    sessionStorage: isBrowser ? globalThis.sessionStorage : null,
    alert: isBrowser ? globalThis.alert : null,
  };
};