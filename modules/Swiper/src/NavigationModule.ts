import {Navigation, Swiper} from "swiper";
import {SwiperModule} from "swiper/types";

export const NavigationModule: SwiperModule = (context: {swiper: Swiper, extendParams: (params: any) => void}) => {
    (Navigation as any)(context);
    context.extendParams({navigation: {nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev"}});
}
