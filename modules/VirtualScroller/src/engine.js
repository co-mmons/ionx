import ItemsContainer from './ItemsContainer'

import ScrollableContainer from "./ScrollableContainer";

import ListTopOffsetWatcher from './ListTopOffsetWatcher'

export default {
	createItemsContainer(getItemsContainerElement) {
		return new ItemsContainer(getItemsContainerElement)
	},
	// Creates a `scrollableContainer`.
	// On client side, `scrollableContainer` is always created.
	// On server side, `scrollableContainer` is not created (and not used).
	createScrollableContainer(getScrollableContainer, getItemsContainerElement) {
        return new ScrollableContainer(getScrollableContainer(), getItemsContainerElement)
	},
	watchListTopOffset({
		getListTopOffset,
		onListTopOffsetChange
	}) {
		return new ListTopOffsetWatcher({
			getListTopOffset,
			onListTopOffsetChange
		})
	}
}
