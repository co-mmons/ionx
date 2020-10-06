import {Component, Element, Event, EventEmitter, Prop, Watch} from "@stencil/core";
import dragula from "dragula";

@Component({
    tag: "ionx-select-orderable",
    styleUrl: "SelectOrderable.scss"
})
export class SelectOrderable {

    @Element()
    element: HTMLElement;

    instance: dragula.Drake;

    @Prop()
    enabled: boolean;

    @Prop()
    values: any[];

    @Event({bubbles: false})
    orderChanged: EventEmitter<any[]>;

    @Watch("enabled")
    async watchEnabled() {

        if (this.enabled) {

            if (this.instance) {
                return;
            }

            this.instance = dragula({
                containers: [this.element.parentElement.querySelector(".ionx--text")],
                // mirrorContainer: document.querySelector("ion-app"),
                direction: "horizontal",

                moves: () => {
                    return this.values && this.values.length > 1;
                }
            });

            this.instance.on("drop", (el, _target, _source, sibling) => {

                const startIndex = parseInt(el.getAttribute("ionx--index"), 10);
                let endIndex = sibling ? parseInt(sibling.getAttribute("ionx--index"), 10) : this.values.length;

                if (endIndex > startIndex) {
                    endIndex -= 1;
                }

                const values = this.values.slice();
                const element = values[startIndex];
                values.splice(startIndex, 1);
                values.splice(endIndex, 0, element);
                console.log(values);

                this.orderChanged.emit(values);
            });

        } else if (this.instance) {
            this.instance.destroy();
            this.instance = undefined;
        }
    }

    connectedCallback() {
        this.watchEnabled();
    }

    disconnectedCallback() {
        if (this.instance) {
            this.instance.destroy();
            this.instance = undefined;
        }
    }

}
