import { AnimationBuilder, NavOutletElement, RouteChain, RouteID, RouterDirection } from "@ionic/core";
export declare const writeNavState: (root: HTMLElement | undefined, chain: RouteChain, direction: RouterDirection, index: number, changed?: boolean, animation?: AnimationBuilder) => Promise<boolean>;
export declare const readNavState: (root: HTMLElement | undefined) => Promise<{
  ids: RouteID[];
  outlet: NavOutletElement;
}>;
export declare const waitUntilNavNode: () => Promise<unknown>;
