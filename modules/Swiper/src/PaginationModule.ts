import {Pagination, Swiper, SwiperOptions} from "swiper";

export function PaginationModule(context: {swiper: Swiper, extendParams: (params: any) => void}) {
    (Pagination as any)(context);
    context.extendParams({pagination: {el: ".swiper-pagination"}} as SwiperOptions);
}
