import { ElementOrComponentWithElement } from "./ElementOrComponentWithElement";
export declare function isReady(elementOrComponent: ElementOrComponentWithElement, options?: {
    noChildrenCheck?: boolean;
    noShadowCheck?: boolean;
}): boolean;
export declare function isChildrenReady(elementOrComponent: ElementOrComponentWithElement, options?: {
    noShadowCheck?: boolean;
}): boolean;
