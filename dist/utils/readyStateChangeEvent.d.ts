export declare function markAsUnready(elementOrComponent: Element | {
    element: Element;
}): void;
export declare function markAsReady(elementOrComponent: Element | {
    element: Element;
}, options?: {
    delay?: number;
}): void;
export declare function isReady(elementOrComponent: Element | {
    element: Element;
}, options?: {
    noChildrenCheck?: boolean;
    noShadowCheck?: boolean;
}): boolean;
export declare function isChildrenReady(element: Element, options?: {
    noShadowCheck?: boolean;
}): boolean;
