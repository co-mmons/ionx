# ionx-toolbar



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute           | Description | Type                                    | Default     |
| --------------------- | ------------------- | ----------- | --------------------------------------- | ----------- |
| `button` _(required)_ | `button`            |             | `"back" \| "close" \| "menu" \| "none"` | `undefined` |
| `buttonHandler`       | --                  |             | `() => void`                            | `undefined` |
| `buttonIcon`          | `button-icon`       |             | `string`                                | `undefined` |
| `defaultBackHref`     | `default-back-href` |             | `string`                                | `undefined` |
| `titleVisible`        | `title-visible`     |             | `boolean`                               | `true`      |
| `titleWrap`           | `title-wrap`        |             | `"collapse" \| boolean`                 | `false`     |


## Dependencies

### Depends on

- ion-toolbar
- ion-menu-button
- ion-button
- ion-icon
- ion-buttons

### Graph
```mermaid
graph TD;
  ionx-toolbar --> ion-toolbar
  ionx-toolbar --> ion-menu-button
  ionx-toolbar --> ion-button
  ionx-toolbar --> ion-icon
  ionx-toolbar --> ion-buttons
  ion-menu-button --> ion-icon
  ion-menu-button --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  style ionx-toolbar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
