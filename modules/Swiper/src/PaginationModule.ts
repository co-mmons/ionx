import {Pagination, Swiper, SwiperOptions} from "swiper";
import {SwiperModule} from "swiper/types";

export const PaginationModule: SwiperModule = (context: {swiper: Swiper, extendParams: (params: any) => void}) => {
    (Pagination as any)(context);
    context.extendParams({pagination: {el: ".swiper-pagination"}} as SwiperOptions);
}
