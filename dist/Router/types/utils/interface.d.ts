import { AnimationBuilder, ComponentProps } from "@ionic/core/components";
import type { NavigationHookCallback } from "@ionic/core/dist/types/components/route/route-interface";
export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}
export interface NavOutlet {
  setRouteId(id: string, params: ComponentProps | undefined, direction: RouterDirection, animation?: AnimationBuilder): Promise<RouteWrite>;
  getRouteId(): Promise<RouteID | undefined>;
}
export interface RouterEventDetail {
  from: string | null;
  redirectedFrom: string | null;
  to: string;
}
export interface RouteRedirect {
  from: string[];
  to?: string[];
}
export interface RouteWrite {
  changed: boolean;
  element: HTMLElement | undefined;
  markVisible?: () => void | Promise<void>;
}
export interface RouteID {
  id: string;
  element: HTMLElement | undefined;
  params?: {
    [key: string]: any;
  };
}
export interface RouteEntry {
  id: string;
  path: string[];
  params: {
    [key: string]: any;
  } | undefined;
  beforeLeave?: NavigationHookCallback;
  beforeEnter?: NavigationHookCallback;
}
export interface RouteNode extends RouteEntry {
  children: RouteTree;
}
export declare type RouterDirection = "forward" | "back" | "root";
export declare type NavOutletElement = NavOutlet & HTMLStencilElement;
export declare type RouteChain = RouteEntry[];
export declare type RouteTree = RouteNode[];
