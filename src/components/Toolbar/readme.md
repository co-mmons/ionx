# ionx-toolbar



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute           | Description | Type                          | Default     |
| --------------------- | ------------------- | ----------- | ----------------------------- | ----------- |
| `button` _(required)_ | `button`            |             | `"back" \| "close" \| "menu"` | `undefined` |
| `buttonHandler`       | --                  |             | `() => void`                  | `undefined` |
| `buttonIcon`          | `button-icon`       |             | `string`                      | `undefined` |
| `defaultBackHref`     | `default-back-href` |             | `string`                      | `undefined` |
| `titleWrap`           | `title-wrap`        |             | `"collapse" \| boolean`       | `false`     |


## Dependencies

### Depends on

- ion-toolbar
- ion-menu-button
- ion-back-button
- ion-buttons

### Graph
```mermaid
graph TD;
  ionx-toolbar --> ion-toolbar
  ionx-toolbar --> ion-menu-button
  ionx-toolbar --> ion-back-button
  ionx-toolbar --> ion-buttons
  ion-menu-button --> ion-icon
  ion-menu-button --> ion-ripple-effect
  ion-back-button --> ion-icon
  ion-back-button --> ion-ripple-effect
  style ionx-toolbar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
