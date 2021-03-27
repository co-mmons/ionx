import {EventUnlisten} from "./EventUnlisten";

export function addEventListener(target: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): EventUnlisten {

    if (!target.addEventListener && (target as MediaQueryList).addListener) {
        (target as MediaQueryList).addListener(listener);
        return () => (target as MediaQueryList).removeListener(listener);
    } else {
        target.addEventListener(type, listener, options);
        return () => target.removeEventListener(type, listener, options);
    }
}
