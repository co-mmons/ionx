import { addEventListener } from "./addEventListener";
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const id = btoa(url).replace("=", "");
        const existing = document.getElementById(id);
        if (existing === null || existing === void 0 ? void 0 : existing.hasAttribute("loaded")) {
            if (existing.getAttribute("loaded") === "true") {
                resolve(false);
            }
            else {
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
        let loadUnlisten, errorUnlisten;
        const cleanup = () => {
            loadUnlisten();
            errorUnlisten();
        };
        loadUnlisten = addEventListener(script, "load", () => {
            script.setAttribute("loaded", "true");
            resolve(true);
            cleanup();
        });
        errorUnlisten = addEventListener(script, "error", () => {
            script.setAttribute("loaded", "error");
            reject();
            cleanup();
        });
        if (!existing) {
            document.head.appendChild(script);
        }
    });
}
