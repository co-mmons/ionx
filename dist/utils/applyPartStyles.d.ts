export declare function applyPartStyles(partName: string, styles: {
    [key: string]: string | undefined;
}): (element: HTMLElement) => void;
export declare function applyPartStyles(element: HTMLElement, partName: string, styles: {
    [key: string]: string | undefined;
}): Promise<void>;
