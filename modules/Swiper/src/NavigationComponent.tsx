import {Component, ComponentInterface, Element, h, Host, Prop} from "@stencil/core";

@Component({
    tag: "ionx-swiper-navigation",
    styleUrl: "NavigationComponent.scss"
})
export class NavigationComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    hideOnMobile: boolean;

    render() {
        return <Host class={{"ionx--hide-on-mobile": this.hideOnMobile}}>
            <div class="swiper-button-prev"/>
            <div class="swiper-button-next"/>
        </Host>;
    }

}
