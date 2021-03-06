import {sleep} from "@co.mmons/js-utils/core";
import {waitTillHydrated} from "./waitTillHydrated";

const fetched: string[] = [];

interface PrefetchComponentOptions {
    delay?: number;
}

export async function prefetchComponent(tagNames: Array<string | string[] | ReadonlyArray<string>>, options: PrefetchComponentOptions);

export async function prefetchComponent(options: PrefetchComponentOptions, ...tagName: Array<string | string[] | ReadonlyArray<string>>);

export async function prefetchComponent(...tagName: Array<string | string[] | ReadonlyArray<string>>);

export async function prefetchComponent() {

    let options: PrefetchComponentOptions;
    let tagNames: string[] = [];

    for (let i = 0; i < arguments.length; i++) {

        if (Array.isArray(arguments[i])) {
            tagNames = tagNames.concat((arguments[i] as string[]).flat().filter(tagName => !fetched.includes(tagName)));

        } else if (typeof arguments[i] === "string") {

            if (!fetched.includes(arguments[i])) {
                tagNames.push(arguments[i]);
            }

        } else if (typeof arguments[i] === "object") {
            options = arguments[i];
        }
    }

    for (const tagName of tagNames) {
        fetched.push(tagName);
    }

    if (typeof options?.delay !== "number" || (typeof options?.delay === "number" && options.delay > 0)) {
        await sleep(options?.delay || 1000);
    }

    for (const tag of tagNames) {

        const element = document.createElement(tag);
        element["prefetch"] = true;

        const hidden = document.createElement("div");
        hidden.style.display = "none";
        hidden.appendChild(element);

        document.body.appendChild(hidden);

        try {
            await waitTillHydrated(element, {interval: 100, timeout: 10000});
        } catch {
            const idx = fetched.indexOf(tag);
            if (idx > -1) {
                fetched.splice(idx, 1);
            }
        }

        element.remove();
        hidden.remove();
    }
}
