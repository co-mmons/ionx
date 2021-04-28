import { EventUnlisten } from "ionx/utils";
import { ToolbarButtonType } from "./ToolbarButtonType";
import { ToolbarTitleWrap } from "./ToolbarTitleWrap";
export declare class Toolbar {
  element: HTMLElement;
  button: ToolbarButtonType;
  buttonIcon: string;
  buttonHandler: () => void;
  defaultBackHref: string;
  titleWrap: ToolbarTitleWrap;
  titleWrapChanged(niu: ToolbarTitleWrap, old: ToolbarTitleWrap): void;
  toolbarElement: HTMLElement;
  get contentElement(): any;
  unlistenScroll: EventUnlisten;
  contentScrolled(scrollElement: HTMLElement): Promise<void>;
  enableCollapsibleTitle(): Promise<void>;
  disableCollapsibleTitle(): void;
  dismissOverlay(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
