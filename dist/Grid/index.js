export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const $GridCol = "ionx-grid-col";
const $GridRow = "ionx-grid-row";
const $Grid = "ionx-grid";

export { $Grid, $GridCol, $GridRow };

import {IonxGrid} from "./ionx-grid";
import {IonxGridCol} from "./ionx-grid-col";
import {IonxGridRow} from "./ionx-grid-row";
(function() {
	if (typeof customElements === "undefined") { return; }
	[{tagName: "ionx-grid", clazz: IonxGrid}, {tagName: "ionx-grid-col", clazz: IonxGridCol}, {tagName: "ionx-grid-row", clazz: IonxGridRow}].forEach(elem => {
		if (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }
	});
}
)();