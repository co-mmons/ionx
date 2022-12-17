export interface ExtendedItemElement {
  /**
   * Indeks w gridzie - zapisujemy go podczas renderowania, aby wiedzieć czy zmieniła się pozycja, co
   * powinno spowodować rerender.
   */
  __ionxMasonryGridCache?: {
    index?: number;
    left?: number;
    top?: number;
    width: number;
    height: number;
  };
  /**
   * If item was already laid on the grid.
   */
  __ionxMasonryGridReady?: boolean;
}
