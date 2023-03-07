# ionx-select-overlay



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute       | Description | Type                                                                   | Default     |
| ---------------------- | --------------- | ----------- | ---------------------------------------------------------------------- | ----------- |
| `checkValidator`       | --              |             | `CheckValidatorFn`                                                     | `undefined` |
| `comparator`           | `comparator`    |             | `"deepEqual" \| "toString" \| ((a: any, b: any) => number \| boolean)` | `undefined` |
| `empty`                | `empty`         |             | `boolean`                                                              | `undefined` |
| `items`                | --              |             | `SelectItem[]`                                                         | `undefined` |
| `labelFormatter`       | --              |             | `LabelFormatterFn`                                                     | `undefined` |
| `lazyItems`            | --              |             | `() => Promise<(SelectValueItem<any> \| SelectDividerItem)[]>`         | `undefined` |
| `multiple`             | `multiple`      |             | `boolean`                                                              | `undefined` |
| `overlay` _(required)_ | `overlay`       |             | `"modal" \| "popover"`                                                 | `undefined` |
| `overlayTitle`         | `overlay-title` |             | `string`                                                               | `undefined` |
| `searchTest`           | --              |             | `(query: string, value: any, label: string) => boolean`                | `undefined` |
| `sortable`             | `sortable`      |             | `boolean`                                                              | `undefined` |
| `values`               | --              |             | `any[]`                                                                | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
