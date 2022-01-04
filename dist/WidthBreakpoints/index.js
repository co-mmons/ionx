export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
export { MediaBreakpoint as WidthBreakpoint } from 'ionx/utils';
export { W as WidthBreakpointsContainer } from './WidthBreakpointsContainer.js';

const containerTagName = "ionx-width-breakpoints";

export { containerTagName };

import {IonxWidthBreakpoints} from "./ionx-width-breakpoints";
(function() {
	if (typeof customElements === "undefined") { return; }
	[{tagName: "ionx-width-breakpoints", clazz: IonxWidthBreakpoints}].forEach(elem => {
		if (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }
	});
}
)();