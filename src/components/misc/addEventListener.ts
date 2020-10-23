import {EventUnlisten} from "./EventUnlisten";

export function addEventListener(target: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): EventUnlisten {
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener, options);
}
