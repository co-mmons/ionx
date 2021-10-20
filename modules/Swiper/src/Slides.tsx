import {Component, ComponentInterface, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-swiper-slides"
})
export class Slides implements ComponentInterface {

    render() {
        return <Host class="swiper-wrapper">
            <slot/>
        </Host>;
    }

}
