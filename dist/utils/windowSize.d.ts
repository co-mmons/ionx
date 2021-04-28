export declare type WindowOrientation = "portrait" | "landscape";
export declare type WindowSize = {
    width: number;
    height: number;
    breakpoint: "xs" | "sm" | "md" | "lg" | "xl";
    orientation: WindowOrientation;
};
export declare type WindowSizeOptions = {
    orientationOnly?: boolean;
    breakpointOnly?: boolean;
};
export declare function windowSize(): WindowSize;
export declare function windowSize(width: number, height: number): WindowSize;
export declare function windowSize(component: any, options?: WindowSizeOptions): WindowSize;
