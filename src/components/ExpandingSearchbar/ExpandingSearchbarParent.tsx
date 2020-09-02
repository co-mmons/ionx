import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-expanding-searchbar-parent",
    styleUrl: "ExpandingSearchbarParent.scss"
})
export class ExpandingSearchbarParent {

    render() {
        return <Host style={{display: "none"}}/>
    }
}
