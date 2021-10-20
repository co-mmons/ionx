import {Component, ComponentInterface, Element, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-swiper-navigation",
    styleUrl: "NavigationComponent.scss"
})
export class NavigationComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    render() {
        return <Host>
            <div class="swiper-button-prev"/>
            <div class="swiper-button-next"/>
        </Host>;
    }

}
