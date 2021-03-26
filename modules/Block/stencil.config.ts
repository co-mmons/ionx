import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {externalsPlugin} from "../externalsPlugin";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        // {type: "dist", dir: "../../dist/Block/tmp"},
        {type: "dist-custom-elements-bundle", dir: "../../dist/Block"}
    ],
    rollupPlugins: {
        before: [externalsPlugin()]
    }
};
