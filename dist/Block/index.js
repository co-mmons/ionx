export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const Block = "ionx-block";

export { Block };

import {IonxBlock} from "./ionx-block";
export function defineIonxBlock() {
	if (typeof customElements === "undefined") { return; }
	[{tagName: "ionx-block", clazz: IonxBlock}].forEach(elem => {
		if (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }
	});
}