import {modalController} from "@ionic/core/components";
import {defineCustomElement as defineFooter} from "@ionic/core/components/ion-footer";
import {defineCustomElement as defineToolbar} from "@ionic/core/components/ion-toolbar";
import {defineCustomElement as defineButtons} from "@ionic/core/components/ion-buttons";
import {defineCustomElement as defineButton} from "@ionic/core/components/ion-button";
import {defineCustomElement as defineIcon} from "ionicons/components/ion-icon";
import {Component, Element, h, Host, Method, Prop} from "@stencil/core";
import {DialogButton} from "./DialogButton";
import {DialogValue, dialogValueAttribute} from "./DialogValue";

defineFooter();
defineToolbar();
defineButton();
defineButtons();
defineIcon();

@Component({
    tag: "ionx-dialog-buttons",
    styleUrl: "DialogButtons.scss",
    scoped: true
})
export class DialogButtons {

    @Element()
    element: HTMLElement;

    @Prop()
    buttons!: DialogButton[];

    @Method()
    async buttonClicked(button: DialogButton) {

        let value: any;

        if (!button.role || button.role !== "cancel") {
            try {
                value = await ((this.element.closest("ionx-dialog").querySelector(`[${dialogValueAttribute}]`) as any as DialogValue)?.dialogValue?.());
            } catch (error) {
                console.debug("Dialog value aborted", error);
                return;
            }
        }

        if (button.valueHandler) {
            try {
                value = button.valueHandler();
                if (value instanceof Promise) {
                    value = await value;
                }

                modalController.dismiss(value, button.role);

            } catch (error) {
                console.debug("Dialog button aborted", error);
            }

            return;
        }

        if (button.handler) {
            let res = button.handler(value);
            if (res instanceof Promise) {
                res = await res;
            }

            if ((typeof res === "boolean" && res) || typeof res !== "boolean") {
                modalController.dismiss(value, button.role);
            }

            return;

        } else {
            modalController.dismiss(button.role !== "cancel" ? value : undefined, button.role);
        }
    }

    render() {

        return <Host>
            <ion-footer>
                <ion-toolbar>
                    <ion-buttons>

                        <slot/>

                        {this.buttons.map(button => <ion-button fill="clear" style={{flex: `${button.flex}` || "1"}} color={button.color || "primary"} size={button.size || "default"} onClick={() => this.buttonClicked(button)}>
                            {button.label && <span>{button.label}</span>}
                            {button.icon && <ion-icon icon={button.icon} slot={button.label ? "start" : "icon-only"}/>}
                        </ion-button>)}

                    </ion-buttons>
                </ion-toolbar>
            </ion-footer>
        </Host>;
    }
}
