export interface LazyLoadItemOptions {
    src?: string | string[];

    /**
     * If style classes should be copied to parent elements.
     * A map, where key is parent selector (used with Element.closest) and value
     * is class name prefix, to which state name will be added.
     */
    styleParents?: {
        [closestSelector: string]: string;
    }
}
