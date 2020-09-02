import {modalController} from "@ionic/core";
import {Component, Element, h, Host, Prop} from "@stencil/core";
import {DialogButton} from "./DialogButton";
import {DialogValue, dialogValueAttribute} from "./DialogValue";

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

    async buttonClicked(button: DialogButton) {

        const value = await ((this.element.closest("ionx-dialog").querySelector(`[${dialogValueAttribute}]`) as any as DialogValue)?.dialogValue?.());

        if (button.handler) {
            const res = button.handler(value);

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
