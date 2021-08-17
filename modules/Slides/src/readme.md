# ionx-slides



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                  | Type            | Default     |
| ----------- | ----------- | -------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `mode`      | `mode`      | The mode determines which platform styles to use.                                            | `"ios" \| "md"` | `undefined` |
| `options`   | `options`   | Options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options | `any`           | `{}`        |
| `pager`     | `pager`     | If `true`, show the pagination.                                                              | `boolean`       | `false`     |
| `scrollbar` | `scrollbar` | If `true`, show the scrollbar.                                                               | `boolean`       | `false`     |


## Events

| Event                     | Description                                                 | Type                |
| ------------------------- | ----------------------------------------------------------- | ------------------- |
| `ionSlideDidChange`       | Emitted after the active slide has changed.                 | `CustomEvent<void>` |
| `ionSlideDoubleTap`       | Emitted when the user double taps on the slide's container. | `CustomEvent<void>` |
| `ionSlideDrag`            | Emitted when the slider is actively being moved.            | `CustomEvent<void>` |
| `ionSlideNextEnd`         | Emitted when the next slide has ended.                      | `CustomEvent<void>` |
| `ionSlideNextStart`       | Emitted when the next slide has started.                    | `CustomEvent<void>` |
| `ionSlidePrevEnd`         | Emitted when the previous slide has ended.                  | `CustomEvent<void>` |
| `ionSlidePrevStart`       | Emitted when the previous slide has started.                | `CustomEvent<void>` |
| `ionSlideReachEnd`        | Emitted when the slider is at the last slide.               | `CustomEvent<void>` |
| `ionSlideReachStart`      | Emitted when the slider is at its initial position.         | `CustomEvent<void>` |
| `ionSlidesDidLoad`        | Emitted after Swiper initialization                         | `CustomEvent<void>` |
| `ionSlideTap`             | Emitted when the user taps/clicks on the slide's container. | `CustomEvent<void>` |
| `ionSlideTouchEnd`        | Emitted when the user releases the touch.                   | `CustomEvent<void>` |
| `ionSlideTouchStart`      | Emitted when the user first touches the slider.             | `CustomEvent<void>` |
| `ionSlideTransitionEnd`   | Emitted when the slide transition has ended.                | `CustomEvent<void>` |
| `ionSlideTransitionStart` | Emitted when the slide transition has started.              | `CustomEvent<void>` |
| `ionSlideWillChange`      | Emitted before the active slide has changed.                | `CustomEvent<void>` |


## Methods

### `getActiveIndex() => Promise<number>`

Get the index of the active slide.

#### Returns

Type: `Promise<number>`



### `getPreviousIndex() => Promise<number>`

Get the index of the previous slide.

#### Returns

Type: `Promise<number>`



### `getSwiper() => Promise<any>`

Get the Swiper instance.
Use this to access the full Swiper API.
See https://idangero.us/swiper/api/ for all API options.

#### Returns

Type: `Promise<any>`



### `isBeginning() => Promise<boolean>`

Get whether or not the current slide is the first slide.

#### Returns

Type: `Promise<boolean>`



### `isEnd() => Promise<boolean>`

Get whether or not the current slide is the last slide.

#### Returns

Type: `Promise<boolean>`



### `length() => Promise<number>`

Get the total number of slides.

#### Returns

Type: `Promise<number>`



### `lockSwipeToNext(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the next slide.

#### Returns

Type: `Promise<void>`



### `lockSwipeToPrev(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the previous slide.

#### Returns

Type: `Promise<void>`



### `lockSwipes(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the next or previous slide.

#### Returns

Type: `Promise<void>`



### `slideNext(speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the next slide.

#### Returns

Type: `Promise<void>`



### `slidePrev(speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the previous slide.

#### Returns

Type: `Promise<void>`



### `slideTo(index: number, speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the specified slide.

#### Returns

Type: `Promise<void>`



### `startAutoplay() => Promise<void>`

Start auto play.

#### Returns

Type: `Promise<void>`



### `stopAutoplay() => Promise<void>`

Stop auto play.

#### Returns

Type: `Promise<void>`



### `update() => Promise<void>`

Update the underlying slider implementation. Call this if you've added or removed
child slides.

#### Returns

Type: `Promise<void>`



### `updateAutoHeight(speed?: number) => Promise<void>`

Force swiper to update its height (when autoHeight is enabled) for the duration
equal to 'speed' parameter.

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------- |
|            | Default slot for adding children of .swiper-wrapper, so all ion-slide should use this slot. |
| `"bottom"` | Content is placed within .swiper-container, after .swiper-wrapper.                          |
| `"top"`    | Content is placed within .swiper-container, before .swiper-wrapper.                         |


## CSS Custom Properties

| Name                               | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| `--bullet-background`              | Background of the pagination bullets             |
| `--bullet-background-active`       | Background of the active pagination bullet       |
| `--progress-bar-background`        | Background of the pagination progress-bar        |
| `--progress-bar-background-active` | Background of the active pagination progress-bar |
| `--scroll-bar-background`          | Background of the pagination scroll-bar          |
| `--scroll-bar-background-active`   | Background of the active pagination scroll-bar   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
