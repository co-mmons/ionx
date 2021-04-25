import {bestLocale, intl} from "@co.mmons/js-intl";
import "@ionic/core";

export default async function() {
    INTL_DEFAULT_LOCALE = "en";
    INTL_SUPPORTED_LOCALE = ["en", "pl"];
    INTL_LOCALE_URL_PARAM = "locale";
    INTL_LOCALE_URL_PATH = "__";
    INTL_LOCALE = bestLocale();

    intl.setLocale(INTL_LOCALE);
}
