import {FunctionalComponent, h} from "@stencil/core";

export const FormFieldLabelButton: FunctionalComponent<Partial<import("@ionic/core").Components.IonButton>> = (props, children) => {
    return <ion-button {...props} size="small" fill="clear" slot="label-end">{children}</ion-button>;
}
