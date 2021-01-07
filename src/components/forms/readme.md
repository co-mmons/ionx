# ionx-form-item



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                                                           | Type                                                   | Default     |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| `control` | --        |                                                                                                                                       | `FormControlState<any>`                                | `undefined` |
| `error`   | `error`   |                                                                                                                                       | `Error \| FormValidationError \| MessageRef \| string` | `undefined` |
| `fill`    | `fill`    | This attributes determines the background and border color of the form item. By default, items have a clear background and no border. | `"clear" \| "outline" \| "solid"`                      | `undefined` |
| `hint`    | `hint`    |                                                                                                                                       | `string`                                               | `undefined` |


## Dependencies

### Used by

 - [ionx-test-date-time](../../test/components)
 - [ionx-test-form](../../test/components/forms)
 - [ionx-test-select](../../test/components)

### Depends on

- ion-item

### Graph
```mermaid
graph TD;
  ionx-form-item --> ion-item
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ionx-test-date-time --> ionx-form-item
  ionx-test-form --> ionx-form-item
  ionx-test-select --> ionx-form-item
  style ionx-form-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
