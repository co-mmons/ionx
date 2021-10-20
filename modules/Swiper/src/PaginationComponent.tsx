import {Component, ComponentInterface, Element, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-swiper-pagination",
    styleUrl: "PaginationComponent.scss"
})
export class PaginationComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    render() {
        return <Host class="swiper-pagination"/>
    }

}
