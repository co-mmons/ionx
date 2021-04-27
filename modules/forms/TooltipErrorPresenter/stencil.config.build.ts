import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../../defaultExternals";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements-bundle",
            dir: "../../../dist/forms/TooltipErrorPresenter",
            defineFunctionName: "defineIonxFormsTooltipErrorPresenter",
            includeGlobalScripts: false,
            external: [
                ...defaultExternals,
                /tippy\.js/,
                /ionx\/(?!modules\/forms\/TooltipErrorPresenter)/
            ],
            empty: true
        }
    ]
};
