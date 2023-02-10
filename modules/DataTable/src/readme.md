# ionx-data-table-th



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                        | Type                                        | Default     |
| ---------------- | ----------------- | -------------------------------------------------- | ------------------------------------------- | ----------- |
| `filterApply`    | --                |                                                    | `(filter: Filter) => any`                   | `undefined` |
| `filterCurrent`  | --                | Returns currently applied filter for given column. | `() => Filter`                              | `undefined` |
| `filterData`     | --                |                                                    | `() => any[]`                               | `undefined` |
| `filterEnabled`  | `filter-enabled`  |                                                    | `boolean`                                   | `undefined` |
| `filterType`     | `filter-type`     |                                                    | `"search" \| "select"`                      | `undefined` |
| `sortingActive`  | `sorting-active`  |                                                    | `"asc" \| "desc" \| boolean`                | `undefined` |
| `sortingApply`   | --                |                                                    | `(order: false \| "asc" \| "desc") => void` | `undefined` |
| `sortingEnabled` | `sorting-enabled` |                                                    | `boolean`                                   | `undefined` |


## Dependencies

### Used by

 - [ionx-data-table](.)

### Graph
```mermaid
graph TD;
  ionx-data-table --> ionx-data-table-th
  style ionx-data-table-th fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
