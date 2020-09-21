export interface ExtendedItemElement {

    /**
     * Indeks w gridzie - zapisujemy go podczas renderowania, aby wiedzieć czy zmieniła się pozycja, co
     * powinno spowodować rerender.
     */
    __ionxMasonryCache?: { index?: number, left?: number, top?: number, rect?: DOMRect };

    __ionxMasonryLaid?: boolean;

}
