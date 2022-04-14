export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const VirtualScroller = "ionx-virtual-scroller";

export { VirtualScroller };

import {IonxVirtualScroller} from "./ionx-virtual-scroller";
(function() {
	if (typeof customElements === "undefined") { return; }
	[{tagName: "ionx-virtual-scroller", clazz: IonxVirtualScroller}].forEach(elem => {
		if (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }
	});
}
)();