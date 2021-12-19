export default class ItemsContainer {

	/**
	 * Constructs a new "container" from an element.
	 * @param {function} getElement
	 */
	constructor(private readonly getElement: () => HTMLElement) {
	}

	/**
	 * Returns an item element's "top offset", relative to the items `container`'s top edge.
	 * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
	 * @return {number}
	 */
	getNthRenderedItemTopOffset(renderedElementIndex) {
        const elem = this.getElement();
        const children = elem.children;
		return children.length > renderedElementIndex ? children[renderedElementIndex].getBoundingClientRect().top - elem.getBoundingClientRect().top : 0;
	}

	/**
	 * Returns an item element's height.
	 * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
	 * @return {number}
	 */
	getNthRenderedItemHeight(renderedElementIndex) {
        const elem = this.getElement();
        const children = elem.children;
		// `offsetHeight` is not precise enough (doesn't return fractional pixels).
		// return this.getElement().childNodes[renderedElementIndex].offsetHeight
		return children.length > renderedElementIndex ? children[renderedElementIndex].getBoundingClientRect().height : 0;
	}

	/**
	 * Returns items container height.
	 * @return {number}
	 */
	getHeight() {
		// `offsetHeight` is not precise enough (doesn't return fractional pixels).
		// return this.getElement().offsetHeight
		return this.getElement().getBoundingClientRect().height
	}

	/**
	 * Removes all item elements of an items container.
	 */
	clear() {
        const elem = this.getElement();
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	}
}
