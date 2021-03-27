import {addEventListener} from "./addEventListener";

export function loadScript(url: string) {

    return new Promise<boolean>((resolve, reject) => {

        const id = btoa(url).replace("=", "");
        const existing = document.getElementById(id);

        if (existing?.hasAttribute("loaded")) {

            if (existing.getAttribute("loaded") === "true") {
                resolve(false);
            } else {
                reject();
            }

            return;
        }

        const script = existing ? existing : document.createElement("script");

        if (!existing) {
            script.id = id;
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
        }

        let loadUnlisten, errorUnlisten: Function;

        const cleanup = () => {
            loadUnlisten();
            errorUnlisten();
        }

        loadUnlisten = addEventListener(script, "load", () => {
            script.setAttribute("loaded", "true");
            resolve(true);
            cleanup();
        });

        errorUnlisten = addEventListener(script, "error",() => {
            script.setAttribute("loaded", "error");
            reject();
            cleanup();
        });

        if (!existing) {
            document.head.appendChild(script);
        }
    });
}
