import { BlockWidthsMap } from "./BlockWidthsMap";
import { BlockWidth } from "./BlockWidth";
export declare class Block {
  innerWidth: BlockWidth | BlockWidthsMap;
  innerAlignment: "start" | "end" | "center";
  innerStyle: {
    [key: string]: string;
  };
  margins: boolean;
  padding: boolean;
  render(): any;
}
