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

export type ScreenRatioOrientation = "portrait" | "landscape";

export function screenRatioOrientation();

export function screenRatioOrientation(width: number, height: number);

export function screenRatioOrientation(component: any);

export function screenRatioOrientation(componentOrWidth?: any | number, height?: number) {

    const component = typeof componentOrWidth === "number" ? undefined : componentOrWidth;

    if (component) {

        const hookName = "ionx/misc/ScreenRatioOrientation";

        let hook = getComponentDisconnectHook<ScreenRatioOrientationHook>(component, hookName);
        if (!hook) {
            addComponentDisconnectHook(component, hookName, hook = new ScreenRatioOrientationHook(component));
        }

        return hook.current;

    } else if (typeof componentOrWidth === "number" && typeof height === "number") {
        return calcOrientation(componentOrWidth, height);
    }

    return calcOrientation(window.innerWidth, window.innerHeight);
}

class ScreenRatioOrientationHook implements ComponentDisconnectHook {

    constructor(private component: any) {

        this.current = calcOrientation(window.innerWidth, window.innerHeight);

        this.unlisten = [
            addEventListener(window, "resize", ev => this.onResize(ev)),
            addEventListener(window, "beforeresize", ev => this.onResize(ev))
        ];
    }

    unlisten: EventUnlisten[];

    current: ScreenRatioOrientation;

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

        const now = calcOrientation(width, height);
        if (now !== this.current) {
            console.debug("[ionx/misc/screenOrientationChange] change", `${this.current} => ${now}`);
            this.current = now;
            forceUpdate(this.component);

        }
    }

    disconnect(): void {
        this.component = undefined;

        for (const un of this.unlisten) {
            un();
        }

        this.unlisten = undefined;
    }
}

function calcOrientation(screenWidth: number, screenHeight: number): ScreenRatioOrientation {
    return (screenWidth <= 767 && screenWidth < screenHeight) || (screenHeight >= 1024 && screenWidth < screenHeight) ? "portrait" : "landscape";
}
