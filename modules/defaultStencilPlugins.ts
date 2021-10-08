import {postcss} from "@stencil/postcss";
import {sass} from "@stencil/sass";
import autoprefixer from "autoprefixer";

export function defaultStencilPlugins() {
    return [sass(), postcss({plugins: [autoprefixer]})]
}
