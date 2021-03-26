import path from "path";

export function resolveIonxPlugin() {

    return {
        id: "resolveIonx",
        resolveId(id: string) {
            if (id.startsWith("ionx/")) {
                const pwd = path.resolve(".");
                return path.join(pwd.replace(/\/modules\/.*/, ""), id.replace("ionx/", "dist/"), "index.js");
            }
        }
    }
}
