import {Component, ComponentInterface, Element, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-swiper-slide",
    styleUrl: "Slide.scss"
})
export class Slide implements ComponentInterface {

    @Element()
    element: HTMLElement;

    render() {
        return <Host class="swiper-slide">
            <slot/>
        </Host>;
    }

}
