export default class ItemsContainer {
  private readonly getElement;
  /**
   * Constructs a new "container" from an element.
   * @param {function} getElement
   */
  constructor(getElement: () => HTMLElement);
  /**
   * Returns an item element's "top offset", relative to the items `container`'s top edge.
   * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
   * @return {number}
   */
  getNthRenderedItemTopOffset(renderedElementIndex: any): number;
  /**
   * Returns an item element's height.
   * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
   * @return {number}
   */
  getNthRenderedItemHeight(renderedElementIndex: any): number;
  /**
   * Returns items container height.
   * @return {number}
   */
  getHeight(): number;
  /**
   * Removes all item elements of an items container.
   */
  clear(): void;
}
