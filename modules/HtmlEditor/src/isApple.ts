export const isApple = typeof navigator !== "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) :
    (typeof window["os"] !== "undefined" ? window["os"].platform() === "darwin" : false)
