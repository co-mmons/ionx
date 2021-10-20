import {Navigation, Swiper} from "swiper";

export function NavigationModule(context: {swiper: Swiper, extendParams: (params: any) => void}) {
    (Navigation as any)(context);
    context.extendParams({navigation: {nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev"}});
}
