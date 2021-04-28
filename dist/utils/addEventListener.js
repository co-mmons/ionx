export function addEventListener(target, type, listener, options) {
    if (!target.addEventListener && target.addListener) {
        target.addListener(listener);
        return () => target.removeListener(listener);
    }
    else {
        target.addEventListener(type, listener, options);
        return () => target.removeEventListener(type, listener, options);
    }
}
