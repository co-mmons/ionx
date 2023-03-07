import {AnimationBuilder, RouterDirection} from "@ionic/core/components";

const SCHEME = /^[a-z][a-z0-9+\-.]*:/;

export async function openUrl(url: string | undefined | null, direction: RouterDirection, animation?: AnimationBuilder): Promise<boolean> {

    if (url && url[0] !== "#" && !SCHEME.test(url)) {
        const router = document.querySelector<HTMLIonRouterElement>("ion-router");
        if (router) {
            return router.push(url, direction, animation);
        }
    }

    return false;
}
