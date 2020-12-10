import {modalController} from "@ionic/core";
import {Component, Element, h, Host, Prop} from "@stencil/core";
import {prefetchComponent} from "../misc";
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

    /**
     * @internal
     */
    @Prop()
    prefetch: boolean;

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

    componentDidLoad() {
        if (this.prefetch) {
            prefetchComponent({delay: 0}, "ion-footer", "ion-toolbar", "ion-buttons", "ion-button", "ion-icon")
        }
    }

    render() {

        if (this.prefetch) {
            return;
        }

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
