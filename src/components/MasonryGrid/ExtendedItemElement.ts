export interface ExtendedItemElement {

    /**
     * Indeks w gridzie - zapisujemy go podczas renderowania, aby wiedzieć czy zmieniła się pozycja, co
     * powinno spowodować rerender.
     */
    __ionxMasonryCache?: { index?: number, left?: number, top?: number, rect?: DOMRect };

    /**
     * If item was already laid on the grid.
     */
    __ionxMasonryLaid?: boolean;

}
