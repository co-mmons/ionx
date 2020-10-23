import {Capacitor} from "@capacitor/core";
import {waitTill} from "@co.mmons/js-utils/core";
import {forceUpdate} from "@stencil/core";
import {
    addComponentDisconnectHook,
    ComponentDisconnectHook,
    getComponentDisconnectHook
} from "../componentDisconnectHooks";
import {addEventListener} from "./addEventListener";
import {EventUnlisten} from "./EventUnlisten";

export type WindowOrientation = "portrait" | "landscape";

export type WindowSize = {width: number, height: number, orientation: WindowOrientation};

export type WindowSizeOptions = {orientationOnly?: boolean};

export function windowSize(): WindowSize;

export function windowSize(width: number, height: number): WindowSize;

export function windowSize(component: any, options?: WindowSizeOptions): WindowSize;

export function windowSize(componentOrWidth?: any | number, heightOrOptions?: number | WindowSizeOptions): WindowSize {

    const component = typeof componentOrWidth === "number" ? undefined : componentOrWidth;

    if (component) {

        const hookName = "ionx/misc/windowSize";

        let hook = getComponentDisconnectHook<WindowSizeHook>(component, hookName);
        if (!hook) {
            addComponentDisconnectHook(component, hookName, hook = new WindowSizeHook(component, typeof heightOrOptions === "object" ? heightOrOptions : undefined));
        }

        return hook.size();

    } else if (typeof componentOrWidth === "number" && typeof heightOrOptions === "number") {
        return {width: componentOrWidth, height: heightOrOptions, orientation: calcOrientation(componentOrWidth, heightOrOptions)};
    }

    return {width: window.innerWidth, height: window.innerHeight, orientation: calcOrientation(window.innerWidth, window.innerHeight)};
}

class WindowSizeHook implements ComponentDisconnectHook {

    constructor(private component: any, private options: WindowSizeOptions) {

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.orientation = calcOrientation(this.width, this.height);

        this.unlisten = [
            addEventListener(window, "resize", ev => this.onResize(ev)),
            addEventListener(window, "beforeresize", ev => this.onResize(ev))
        ];
    }

    unlisten: EventUnlisten[];

    orientation: "landscape" | "portrait";

    width: number;

    height: number;

    size() {
        return {width: this.width, height: this.height, orientation: this.orientation};
    }

    async onResize(event: Event) {

        let width = window.innerWidth;
        let height = window.innerHeight;

        if (Capacitor.platform === "ios") {

            if (event.type === "resize") {
                return;
            }

            width = (event as CustomEvent).detail.width;
            height = (event as CustomEvent).detail.height;

            try {
                await waitTill(() => window.innerWidth === width && window.innerHeight === height, undefined, 2000);
            } catch {
            }
        }

        const orientation = calcOrientation(width, height);
        if (orientation !== this.orientation || (!this.options?.orientationOnly && (this.width !== width || this.height !== height))) {
            console.debug("[ionx/misc/windowSize] change", this.width, this.height, this.orientation);

            this.orientation = orientation;
            this.width = width;
            this.height = height;

            forceUpdate(this.component);
        }
    }

    disconnect(): void {
        this.component = undefined;

        for (const un of this.unlisten) {
            try {
                un();
            } catch {
            }
        }

        this.unlisten = undefined;
        this.options = undefined;
    }
}

function calcOrientation(screenWidth: number, screenHeight: number): WindowOrientation {
    return (screenWidth <= 767 && screenWidth < screenHeight) || (screenHeight >= 1024 && screenWidth < screenHeight) ? "portrait" : "landscape";
}
