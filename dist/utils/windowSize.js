import { Capacitor } from "@capacitor/core";
import { waitTill } from "@co.mmons/js-utils/core";
import { forceUpdate } from "@stencil/core";
import { addComponentDisconnectHook, getComponentDisconnectHook } from "./componentDisconnectHooks";
import { addEventListener } from "./addEventListener";
export function windowSize(componentOrWidth, heightOrOptions) {
    const component = typeof componentOrWidth === "number" ? undefined : componentOrWidth;
    if (component) {
        const hookName = "ionx/misc/windowSize";
        let hook = getComponentDisconnectHook(component, hookName);
        if (!hook) {
            addComponentDisconnectHook(component, hookName, hook = new WindowSizeHook(component, typeof heightOrOptions === "object" ? heightOrOptions : undefined));
        }
        return hook.size();
    }
    else if (typeof componentOrWidth === "number" && typeof heightOrOptions === "number") {
        return { width: componentOrWidth, height: heightOrOptions, breakpoint: calcBreakpoint(componentOrWidth), orientation: calcOrientation(componentOrWidth, heightOrOptions) };
    }
    return { width: window.innerWidth, height: window.innerHeight, breakpoint: calcBreakpoint(window.innerWidth), orientation: calcOrientation(window.innerWidth, window.innerHeight) };
}
class WindowSizeHook {
    constructor(component, options) {
        this.component = component;
        this.options = options;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.orientation = calcOrientation(this.width, this.height);
        this.breakpoint = calcBreakpoint(this.width);
        this.unlisten = [
            addEventListener(window, "resize", ev => this.onResize(ev)),
            addEventListener(window, "beforeresize", ev => this.onResize(ev))
        ];
    }
    size() {
        return { width: this.width, height: this.height, breakpoint: this.breakpoint, orientation: this.orientation };
    }
    async onResize(event) {
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (Capacitor.platform === "ios") {
            if (event.type === "resize") {
                return;
            }
            width = event.detail.width;
            height = event.detail.height;
            try {
                await waitTill(() => window.innerWidth === width && window.innerHeight === height, undefined, 2000);
            }
            catch {
            }
        }
        const breakpoint = calcBreakpoint(width);
        const orientation = calcOrientation(width, height);
        let changed = false;
        if (this.options?.orientationOnly) {
            changed = this.orientation !== orientation;
        }
        else if (this.options?.breakpointOnly) {
            changed = this.breakpoint !== breakpoint;
        }
        else if (this.width !== width || this.height !== height) {
            changed = true;
        }
        if (changed) {
            console.debug("[ionx/misc/windowSize] change", this.width, this.height, this.breakpoint, this.orientation);
            this.orientation = orientation;
            this.breakpoint = breakpoint;
            this.width = width;
            this.height = height;
            forceUpdate(this.component);
        }
    }
    disconnect() {
        this.component = undefined;
        for (const un of this.unlisten) {
            try {
                un();
            }
            catch {
            }
        }
        this.unlisten = undefined;
        this.options = undefined;
    }
}
function calcOrientation(screenWidth, screenHeight) {
    return (screenWidth <= 767 && screenWidth < screenHeight) || (screenHeight >= 1024 && screenWidth < screenHeight) ? "portrait" : "landscape";
}
function calcBreakpoint(screenWidth) {
    if (screenWidth >= 1200) {
        return "xl";
    }
    else if (screenWidth >= 992) {
        return "lg";
    }
    else if (screenWidth >= 768) {
        return "md";
    }
    else if (screenWidth >= 576) {
        return "sm";
    }
    else {
        return "xs";
    }
}
