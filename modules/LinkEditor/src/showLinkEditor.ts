import {createAnimation} from "@ionic/core";
import {defineIonxDialog, showDialog} from "ionx/Dialog";
import {Link} from "./Link";
import {LinkEditorProps} from "./LinkEditorProps";

interface LinkEditorDialogOptions {
    animated?: boolean | "onlyEnter";
}

export async function showLinkEditor(props: LinkEditorProps, dialogOptions?: LinkEditorDialogOptions): Promise<Link> {
    defineIonxDialog();

    const dialog = await showDialog({
        component: "ionx-link-editor-dialog",
        componentProps: {editorProps: props},
        animated: dialogOptions?.animated !== false,
        leaveAnimation: dialogOptions?.animated === "onlyEnter" ? (_baseEl) => createAnimation() : undefined
    });

    const result = await dialog.onDidDismiss();
    if (result.role === "ok") {
        return result.data;
    }
}
