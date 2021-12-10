import {sleep} from "@co.mmons/js-utils/core";
import {Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Method, Prop, Watch} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {waitTillHydrated} from "ionx/utils";
import {Swiper, SwiperOptions} from "swiper";
import {SwiperEvents} from "swiper/types";

@Component({
    tag: "ionx-swiper",
    styleUrl: "SwiperComponent.scss"
})
export class SwiperComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    options?: SwiperOptions;

    @Event()
    swiperEvent!: EventEmitter<{swiper: Swiper, eventName: keyof SwiperEvents, eventArgs: any[]}>;

    mutationObserver?: MutationObserver;

    /**
     * Swiper instance set in constructor of new Swiper instance.
     * It is set as Prop, but should be treated as readonly.
     *
     * @internal
     */
    @Prop()
    readonly swiper: Swiper;

    /**
     * Return the Swiper instance but making sure, that it was initialized.
     * When accessing {@link #swiper} it can return undefined when not yet initialized.
     */
    @Method()
    async asyncSwiper(): Promise<Swiper> {

        while(!this.swiper) {
            await sleep(10);
        }

        return this.swiper;
    }

    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     */
    @Method()
    async update() {
        if (this.swiper) {
            this.swiper.update();
        }
    }

    @Watch("options")
    async optionsChanged(niu: SwiperOptions, old: SwiperOptions) {
        if (this.swiper && !deepEqual(niu, old)) {
            this.swiper.destroy();
            await this.initSwiper();
        }
    }

    private normalizeOptions(): any {

        const swiperOptions: any = {
            a11y: {
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide"
            }
        };

        return {...swiperOptions, ...this.options, ...{onAny: (eventName, ...args) => this.swiperEvent.emit({eventName, swiper: this.swiper, eventArgs: args.splice(1)})}};
    }

    async initSwiper() {

        if (this.swiper) {
            return;
        }

        await waitTillHydrated(this.element);

        new Swiper(this.element, this.normalizeOptions());
    }

    connectedCallback() {

        this.mutationObserver = new MutationObserver(() => {
            this.update();
        });

        this.mutationObserver.observe(this.element, {childList: true, subtree: true});

        this.initSwiper();
    }

    disconnectedCallback() {

        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;

        this.swiper.destroy();
    }

    render() {
        return <Host class="swiper">
            <slot/>
        </Host>;
    }

}
