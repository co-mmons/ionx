import {FreeMode, Swiper} from "swiper";
import {SwiperModule} from "swiper/types";

export const FreeModeModule: SwiperModule = (context: {swiper: Swiper, extendParams: (params: any) => void}) => {
    (FreeMode as any)(context);
}
