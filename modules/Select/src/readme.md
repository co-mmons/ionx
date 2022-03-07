# ionx-select-overlay



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute       | Description | Type                                                                   | Default     |
| ---------------------- | --------------- | ----------- | ---------------------------------------------------------------------- | ----------- |
| `checkValidator`       | --              |             | `(value: any, checked: boolean, otherCheckedValues: any[]) => any[]`   | `undefined` |
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


## Dependencies

### Depends on

- ion-item
- ion-label
- ion-spinner
- ion-checkbox
- ion-header
- ion-button
- ion-toolbar
- ion-searchbar
- ion-content
- ion-list
- ion-virtual-scroll
- ion-footer

### Graph
```mermaid
graph TD;
  ionx-select-overlay --> ion-item
  ionx-select-overlay --> ion-label
  ionx-select-overlay --> ion-spinner
  ionx-select-overlay --> ion-checkbox
  ionx-select-overlay --> ion-header
  ionx-select-overlay --> ion-button
  ionx-select-overlay --> ion-toolbar
  ionx-select-overlay --> ion-searchbar
  ionx-select-overlay --> ion-content
  ionx-select-overlay --> ion-list
  ionx-select-overlay --> ion-virtual-scroll
  ionx-select-overlay --> ion-footer
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ion-searchbar --> ion-icon
  style ionx-select-overlay fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
