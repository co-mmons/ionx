/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AnimationBuilder, RouterDirection, RouterEventDetail } from "@ionic/core";
export namespace Components {
    interface IonRouter {
        /**
          * Go back to previous page in the window.history.
         */
        "back": () => Promise<void>;
        "canTransition": () => Promise<string | boolean>;
        "navChanged": (direction: RouterDirection) => Promise<boolean>;
        "printDebug": () => Promise<void>;
        /**
          * Navigate to the specified URL.
          * @param url The url to navigate to.
          * @param direction The direction of the animation. Defaults to `"forward"`.
         */
        "push": (url: string, direction?: RouterDirection, animation?: AnimationBuilder) => Promise<boolean>;
        /**
          * By default `ion-router` will match the routes at the root path ("/"). That can be changed when
         */
        "root": string;
        /**
          * The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it"s deployed.  Usually "hash-less" navigation works better for SEO and it"s more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs.
         */
        "useHash": boolean;
    }
}
declare global {
    interface HTMLIonRouterElement extends Components.IonRouter, HTMLStencilElement {
    }
    var HTMLIonRouterElement: {
        prototype: HTMLIonRouterElement;
        new (): HTMLIonRouterElement;
    };
    interface HTMLElementTagNameMap {
        "ion-router": HTMLIonRouterElement;
    }
}
declare namespace LocalJSX {
    interface IonRouter {
        /**
          * Emitted when the route had changed
         */
        "onIonRouteDidChange"?: (event: CustomEvent<RouterEventDetail>) => void;
        /**
          * Event emitted when the route is about to change
         */
        "onIonRouteWillChange"?: (event: CustomEvent<RouterEventDetail>) => void;
        /**
          * By default `ion-router` will match the routes at the root path ("/"). That can be changed when
         */
        "root"?: string;
        /**
          * The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it"s deployed.  Usually "hash-less" navigation works better for SEO and it"s more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs.
         */
        "useHash"?: boolean;
    }
    interface IntrinsicElements {
        "ion-router": IonRouter;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ion-router": LocalJSX.IonRouter & JSXBase.HTMLAttributes<HTMLIonRouterElement>;
        }
    }
}
