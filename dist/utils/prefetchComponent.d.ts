interface PrefetchComponentOptions {
    delay?: number;
}
export declare function prefetchComponent(tagNames: Array<string | string[] | ReadonlyArray<string>>, options: PrefetchComponentOptions): any;
export declare function prefetchComponent(options: PrefetchComponentOptions, ...tagName: Array<string | string[] | ReadonlyArray<string>>): any;
export declare function prefetchComponent(...tagName: Array<string | string[] | ReadonlyArray<string>>): any;
export {};
