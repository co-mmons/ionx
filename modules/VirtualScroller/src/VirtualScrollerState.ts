export interface VirtualScrollerState {
    items?: any[];
    firstShownItemIndex?: number;
    lastShownItemIndex?: number;
    beforeItemsHeight?: number;
    afterItemsHeight?: number;
    itemHeights?: number[];
}
