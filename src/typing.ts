type C2D = CanvasRenderingContext2D;
type ME = MouseEvent;
type CE = HTMLCanvasElement;

interface TextOptions {
  fillStyle?: string;
  font?: string;
  textAlign?: string;
  textBaseline?: string;
}
interface TextPOS {
  left: number;
  /** start from baseLIne */
  top: number;
  width: number;
  /**fontBoundingBoxDescent */
  descent: number;
  /** fontBoundingBoxAscent: textBaseline 到用于渲染文本的所有字体的最高边界矩形的顶部的距离*/
  ascent: number;
}

interface TextConfig extends TextPOS {
  text: string;
  options?: TextOptions;
}

type TC = TextConfig;

interface ISetTextConfig {
  ascent: number;
  descent: number;
  width: number;
}

interface SelectTextPos {
  selecting: boolean;
  count: number;
  i: IBlinkingData;
}

interface IBlinkingData {
  left: number;
  top: number;
  height: number;
  textTop: number;
  /** the index of text in textConfig */
  index: number;
  /** the index of blinking in text */
  textIndex: number;
  text: TC;
}
