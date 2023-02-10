# ionx-loading



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                     | Type                               | Default         |
| ----------------- | ------------------ | ------------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| `backdropOpacity` | `backdrop-opacity` |                                                                                 | `number`                           | `undefined`     |
| `backdropTheme`   | `backdrop-theme`   |                                                                                 | `"dark" \| "light"`                | `undefined`     |
| `backdropVisible` | `backdrop-visible` |                                                                                 | `boolean`                          | `undefined`     |
| `color`           | `color`            |                                                                                 | `string`                           | `undefined`     |
| `cover`           | `cover`            | If loading element should fill available space and center content both h and v. | `boolean`                          | `undefined`     |
| `header`          | `header`           |                                                                                 | `string`                           | `undefined`     |
| `message`         | `message`          |                                                                                 | `string`                           | `undefined`     |
| `progressBuffer`  | `progress-buffer`  |                                                                                 | `number`                           | `0`             |
| `progressMessage` | `progress-message` |                                                                                 | `string`                           | `undefined`     |
| `progressPercent` | `progress-percent` |                                                                                 | `number`                           | `undefined`     |
| `progressType`    | `progress-type`    |                                                                                 | `"determinate" \| "indeterminate"` | `"determinate"` |
| `progressValue`   | `progress-value`   |                                                                                 | `number`                           | `0`             |
| `type`            | `type`             | The type of loader.                                                             | `"progress" \| "spinner"`          | `"spinner"`     |


## Methods

### `dismiss() => Promise<void>`



#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                         | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| `--loading-backdrop-color`   | RGB color for backdrop. By default --ion-background-color-rgb is used. |
| `--loading-backdrop-opacity` | numeric value, from 0 to 1. By default 0.8.                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
