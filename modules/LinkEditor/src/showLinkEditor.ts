import {defineIonxDialog, showDialog} from "ionx/Dialog";
import {Link} from "./Link";
import {LinkEditorProps} from "./LinkEditorProps";

export async function showLinkEditor(props: LinkEditorProps): Promise<Link> {
    defineIonxDialog();

    const dialog = await showDialog({
        component: "ionx-link-editor-dialog",
        componentProps: {editorProps: props},
    });

    const result = await dialog.onDidDismiss();
    if (result.role === "ok") {
        return result.data;
    }
}
