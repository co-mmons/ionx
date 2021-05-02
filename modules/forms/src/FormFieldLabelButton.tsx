import {FunctionalComponent, h} from "@stencil/core";

export const FormFieldLabelButton: FunctionalComponent<Partial<import("@ionic/core").Components.IonButton> & {onClick?: (ev?: MouseEvent) => any, ref?: (el: HTMLElement) => any}> = (props, children) => {
    return <ion-button {...props} size="small" fill="clear" slot="label-end">{children}</ion-button>;
}
