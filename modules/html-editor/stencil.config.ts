import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {externalsPlugin} from "../externalsPlugin";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {type: "dist-custom-elements-bundle", dir: "../../dist/html-editor", typesDir: ""}
    ],
    rollupPlugins: {
        before: [externalsPlugin()]
    }
};
