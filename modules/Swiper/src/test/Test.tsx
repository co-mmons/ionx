import {modalController} from "@ionic/core";
import {Component, Element, h, Host, State} from "@stencil/core";
import {Autoplay, SwiperOptions} from "swiper";
import {SwiperEvents} from "swiper/types";
import {NavigationModule} from "../NavigationModule";
import {PaginationModule} from "../PaginationModule";

@Component({
    tag: "ionx-test",
    styleUrl: "Test.scss",
    scoped: true
})
export class Test {

    @Element()
    element: HTMLElement;

    async openModal() {

        const modal = await modalController.create({
            component: "ionx-test"
        });

        modal.present();

    }

    @State()
    options: SwiperOptions = {
        modules: [NavigationModule, PaginationModule],
        slidesPerView: "auto",
        spaceBetween: 16,
        pagination: {dynamicBullets: true}
    }

    @State()
    logEvents = false;

    logEvent(eventName: keyof SwiperEvents) {

        if (this.logEvents) {
            const area = this.element.querySelector("textarea");
            area.insertBefore(document.createTextNode(eventName + "\n"), area.firstChild);
            area.scrollTop = 0;
        }

    }

    render() {
        return <Host>
            <ionx-swiper options={this.options} onSwiperEvent={(ev) => this.logEvent(ev.detail.eventName)}>

                <ionx-swiper-slides>
                    {[1, 2, 3, 4, 5, 6].map(slide => <ionx-swiper-slide>{slide}</ionx-swiper-slide>)}
                </ionx-swiper-slides>

                <ionx-swiper-navigation/>

                <ionx-swiper-pagination/>

            </ionx-swiper>

            <ion-button onClick={() => this.openModal()}>open modal</ion-button>

            <ion-button onClick={() => {
                this.options = Object.assign({}, this.options, {modules: [Autoplay].concat(this.options.modules), autoplay: !this.options.autoplay} as SwiperOptions);
            }}>{this.options.autoplay ? "disable" : "enable"} auto play</ion-button>

            <ion-button onClick={() => this.logEvents = !this.logEvents}>{this.logEvents ? "disable" : "enable"} log events</ion-button>

            <div>
                <textarea style={{width: "100%", height: "300px"}}/>
            </div>

        </Host>
    }
}
