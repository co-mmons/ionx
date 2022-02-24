import { ElementOrComponentWithElement } from "./ElementOrComponentWithElement";
interface MarkAsReadyOptions {
    delay?: number;
}
export declare function markAsReady(elementOrComponent: ElementOrComponentWithElement): any;
export declare function markAsReady(elementOrComponent: ElementOrComponentWithElement, options: MarkAsReadyOptions): any;
export declare function markAsReady(elementOrComponent: ElementOrComponentWithElement, partName: string, options?: MarkAsReadyOptions): any;
export {};
