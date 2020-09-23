import {Component, Host, h, Prop, Event, EventEmitter} from "@stencil/core";

@Component({
    tag: "ionx-select",
    styleUrl: "Select.scss"
})
export class Select {

    @Prop()
    placeholder: string;

    @Prop()
    overlay: "popover" | "modal";

    @Prop()
    overlayOptions: {whiteSpace?: "nowrap" | "normal", title?: string};

    /**
     * Whether value should be always returned as array, no matter if multiple is set to true.
     */
    @Prop()
    alwaysArray: boolean;

    /**
     * Compare values as string, that is if toString() of both values are equal.
     */
    @Prop()
    compareAsString: boolean;

    @Prop()
    comparator: (a: any, b: any) => boolean | number;

    /**
     * If multiple value selection is allowed.
     */
    @Prop()
    multiple: boolean;

    /**
     * If multiple values selection can be ordered after selection.
     */
    @Prop()
    orderable: boolean;

    @Prop()
    empty: boolean = true;

    @Prop()
    readonly: boolean = true;

    /**
     * A function, that will be used for testing if value passes search critieria.
     * Default implementation checks lowercased label of value against
     * lowercased searched text.
     */
    @Prop()
    searchTest: (query: string, value: any, label: string) => boolean;

    @Prop()
    checkValidator: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];

    @Event()
    change: EventEmitter<any>;

    render() {
        return <Host>
            <slot/>
        </Host>;
    }

}
