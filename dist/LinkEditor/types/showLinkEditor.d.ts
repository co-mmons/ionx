import { Link } from "./Link";
import { LinkEditorProps } from "./LinkEditorProps";
interface LinkEditorDialogOptions {
  animated?: boolean | "onlyEnter";
}
export declare function showLinkEditor(props: LinkEditorProps, dialogOptions?: LinkEditorDialogOptions): Promise<Link>;
export {};
