import {FunctionalComponent, h} from "@stencil/core";
import {defineCustomElement as defineButton} from "@ionic/core/components/ion-button";

defineButton();

export const FormFieldLabelButton: FunctionalComponent<Partial<import("@ionic/core/components").Components.IonButton> & {onClick?: (ev?: MouseEvent) => any, ref?: (el: HTMLElement) => any}> = (props, children) => {
    return <ion-button {...props} size="small" fill="clear" slot="label-end">{children}</ion-button>;
}
