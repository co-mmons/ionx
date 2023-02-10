import {Component, ComponentInterface, Event, EventEmitter, Listen} from "@stencil/core";

@Component({
    tag: "ionx-fix-solid",
    styles: {"md": "SolidFixBuild.css", "ios": "SolidFixBuild.css"},
    shadow: true
})
export class SolidFixBuild implements ComponentInterface {

    @Event()
    someEvent: EventEmitter;

    @Listen("sdsdsd")
    someListen() {

    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    componentDidRender() {
    }

    componentDidLoad() {
    }

    componentDidUpdate() {
    }

    componentShouldUpdate(_newVal: any, _oldVal: any, _propName: string): boolean | void {
    }

    componentWillLoad(): Promise<void> | void {
    }

    componentWillRender(): Promise<void> | void {
    }

    componentWillUpdate(): Promise<void> | void {
    }

}
