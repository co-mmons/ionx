# ionx-select-overlay



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute       | Description | Type                                                                   | Default     |
| ---------------------- | --------------- | ----------- | ---------------------------------------------------------------------- | ----------- |
| `checkValidator`       | --              |             | `(value: any, checked: boolean, otherCheckedValues: any[]) => any[]`   | `undefined` |
| `comparator`           | `comparator`    |             | `"deepEqual" \| "toString" \| ((a: any, b: any) => number \| boolean)` | `undefined` |
| `empty`                | `empty`         |             | `boolean`                                                              | `undefined` |
| `labelFormatter`       | --              |             | `(value: any) => string`                                               | `undefined` |
| `multiple`             | `multiple`      |             | `boolean`                                                              | `undefined` |
| `options`              | --              |             | `SelectOption[]`                                                       | `undefined` |
| `orderable`            | `orderable`     |             | `boolean`                                                              | `undefined` |
| `overlay` _(required)_ | `overlay`       |             | `"modal" \| "popover"`                                                 | `undefined` |
| `overlayTitle`         | `overlay-title` |             | `string`                                                               | `undefined` |
| `searchTest`           | --              |             | `(query: string, value: any, label: string) => boolean`                | `undefined` |
| `values`               | --              |             | `any[]`                                                                | `undefined` |


## Dependencies

### Depends on

- ion-item
- ion-checkbox
- ion-label
- ion-header
- ion-toolbar
- ion-back-button
- ion-title
- ion-buttons
- ion-button
- ion-searchbar
- ion-content
- [ionx-loading](../Loading)
- ion-list
- ion-virtual-scroll
- ion-footer

### Graph
```mermaid
graph TD;
  ionx-select-overlay --> ion-item
  ionx-select-overlay --> ion-checkbox
  ionx-select-overlay --> ion-label
  ionx-select-overlay --> ion-header
  ionx-select-overlay --> ion-toolbar
  ionx-select-overlay --> ion-back-button
  ionx-select-overlay --> ion-title
  ionx-select-overlay --> ion-buttons
  ionx-select-overlay --> ion-button
  ionx-select-overlay --> ion-searchbar
  ionx-select-overlay --> ion-content
  ionx-select-overlay --> ionx-loading
  ionx-select-overlay --> ion-list
  ionx-select-overlay --> ion-virtual-scroll
  ionx-select-overlay --> ion-footer
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-back-button --> ion-icon
  ion-back-button --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ion-searchbar --> ion-icon
  ionx-loading --> ion-spinner
  ionx-loading --> ion-text
  ionx-loading --> ion-progress-bar
  style ionx-select-overlay fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
