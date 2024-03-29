export default class ScrollableContainer {
	/**
	 * Constructs a new "scrollable container" from an element.
	 * @param {Element} scrollableContainer
	 * @param {func} getItemsContainerElement — Returns items "container" element.
	 */
	constructor(element, getItemsContainerElement) {
		this.element = element
		this.getItemsContainerElement = getItemsContainerElement
	}

	/**
	 * Returns the current scroll position.
	 * @return {number}
	 */
	getScrollY() {
		return this.element.scrollTop
	}

	/**
	 * Scrolls to a specific position.
	 * @param {number} scrollY
	 */
	scrollToY(scrollY) {
		// IE 11 doesn't seem to have a `.scrollTo()` method.
		// https://gitlab.com/catamphetamine/virtual-scroller/-/issues/10
		// https://stackoverflow.com/questions/39908825/window-scrollto-is-not-working-in-internet-explorer-11
		if (this.element.scrollTo) {
			this.element.scrollTo(0, scrollY)
		} else {
			this.element.scrollTop = scrollY
		}
	}

	/**
	 * Returns "scrollable container" width,
	 * i.e. the available width for its content.
	 * @return {number}
	 */
	getWidth() {
		return this.element.offsetWidth
	}

	/**
	 * Returns the height of the "scrollable container" itself.
	 * Not to be confused with the height of "scrollable container"'s content.
	 * @return {number}
	 */
	getHeight() {
		// if (!this.element && !precise) {
		// 	return getScreenHeight()
		// }
		return this.element.offsetHeight
	}

	/**
	 * Returns a "top offset" of an items container element
	 * relative to the "scrollable container"'s top edge.
	 * @return {number}
	 */
	getItemsContainerTopOffset() {
		const scrollableContainerTop = this.element.getBoundingClientRect().top
		const scrollableContainerBorderTopWidth = this.element.clientTop
		const itemsContainerTop = this.getItemsContainerElement().getBoundingClientRect().top
		return (itemsContainerTop - scrollableContainerTop) + this.getScrollY() - scrollableContainerBorderTopWidth
	}

	// isVisible() {
	// 	const { top, bottom } = this.element.getBoundingClientRect()
	// 	return bottom > 0 && top < getScreenHeight()
	// }

	/**
	 * Adds a "scroll" event listener to the "scrollable container".
	 * @param {onScroll} Should be called whenever the scroll position inside the "scrollable container" (potentially) changes.
	 * @return {function} Returns a function that stops listening.
	 */
	onScroll(onScroll) {
		this.element.addEventListener('scroll', onScroll)
		return () => this.element.removeEventListener('scroll', onScroll)
	}

	/**
	 * Adds a "resize" event listener to the "scrollable container".
	 * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
   * @return {function} Returns a function that stops listening.
	 */
	onResize(onResize) {
		// Watches "scrollable container"'s dimensions via a `ResizeObserver`.
		// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
		// https://web.dev/resize-observer/
		let unobserve
		if (typeof ResizeObserver !== 'undefined') {
			const resizeObserver = new ResizeObserver((entries) => {

                const page = this.getItemsContainerElement()?.closest(".ion-page");
                if (page && page.classList.contains("ion-page-hidden")) {
                    return;
                }

				// "one entry per observed element".
				// https://web.dev/resize-observer/
				// `entry.target === this.element`.
				const entry = entries[0]
				// // If `entry.contentBoxSize` property is supported by the web browser.
				// if (entry.contentBoxSize) {
				// 	// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
				// 	const width = entry.contentBoxSize.inlineSize
				// 	const height = entry.contentBoxSize.blockSize
				// }
				onResize()
			})
			resizeObserver.observe(this.element)
			unobserve = () => resizeObserver.unobserve(this.element)
		}
		// I guess, if window is resized, `onResize()` will be triggered twice:
		// once for window resize, and once for the scrollable container resize.
		// But `onResize()` also has an internal check: if the container size
		// hasn't changed since the previous time `onResize()` has been called,
		// then `onResize()` doesn't do anything, so, I guess, there shouldn't be
		// any "performance implications" of running the listener twice in such case.
		const unlistenGlobalResize = addGlobalResizeListener(onResize, {
			itemsContainerElement: this.getItemsContainerElement()
		})
		return () => {
			if (unobserve) {
				unobserve()
			}
			unlistenGlobalResize()
		}
	}
}

/**
 * Adds a "resize" event listener to the `window`.
 * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
 * @param  {Element} options.itemsContainerElement — The items "container" element, which is not the same as the "scrollable container" element. For example, "scrollable container" could be resized while the list element retaining its size. One such example is a user entering fullscreen mode on an HTML5 `<video/>` element: in that case, a "resize" event is triggered on a window, and window dimensions change to the user's screen size, but such "resize" event can be ignored because the list isn't visible until the user exits fullscreen mode.
 * @return {function} Returns a function that stops listening.
 */
function addGlobalResizeListener(onResize, { itemsContainerElement }) {
	const onResizeListener = () => {
		// By default, `VirtualScroller` always performs a re-layout
		// on window `resize` event. But browsers (Chrome, Firefox)
		// [trigger](https://developer.mozilla.org/en-US/docs/Web/API/Window/fullScreen#Notes)
		// window `resize` event also when a user switches into fullscreen mode:
		// for example, when a user is watching a video and double-clicks on it
		// to maximize it. And also when the user goes out of the fullscreen mode.
		// Each such fullscreen mode entering/exiting will trigger window `resize`
		// event that will it turn trigger a re-layout of `VirtualScroller`,
		// resulting in bad user experience. To prevent that, such cases are filtered out.
		// Some other workaround:
		// https://stackoverflow.com/questions/23770449/embedded-youtube-video-fullscreen-or-causing-resize
		if (document.fullscreenElement) {
			// If the fullscreened element doesn't contain the list
			// (and is not the list itself), then the layout hasn't been affected,
			// so don't perform a re-layout.
			//
			// For example, suppose there's a list of items, and some item contains a video.
			// If, upon clicking such video, it plays inline, and the user enters
			// fullscreen mode while playing such inline video, then the layout won't be
			// affected, and so such `resize` event should be ignored: when
			// `document.fullscreenElement` is in a separate "branch" relative to the
			// `container`.
			//
			// Another scenario: suppose that upon click, the video doesn't play inline,
			// but instead a "Slideshow" component is open, with the video shown at the
			// center of the screen in an overlay. If then the user enters fullscreen mode,
			// the layout wouldn't be affected too, so such `resize` event should also be
			// ignored: when `document.fullscreenElement` is inside the `container`.
			//
			if (document.fullscreenElement.contains(itemsContainerElement)) {
				// The element is either the `container`'s ancestor,
				// Or is the `container` itself.
				// (`a.contains(b)` includes the `a === b` case).
				// So the `resize` event will affect the `container`'s dimensions.
			} else {
				// The element is either inside the `container`,
				// Or is in a separate tree.
				// So the `resize` event won't affect the `container`'s dimensions.
				return
			}
		}
		onResize()
	}
	window.addEventListener('resize', onResizeListener)
	return () => window.removeEventListener('resize', onResizeListener)
}
