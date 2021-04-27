import {intl, setMessages} from "@co.mmons/js-intl";

let loaded: string[] = [];

async function importJson(): Promise<{[key: string]: any}> {
    const locale = intl.locale;

    switch (locale) {
    }

    return Promise.resolve({});
}

export async function loadIntlMessages() {

    if (loaded.includes(intl.locale)) {
        return;
    }

    setMessages("ionx/LinkEditor", intl.locale, await importJson());

    loaded.push(intl.locale);
}
