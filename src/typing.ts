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

interface ISetTextConfig {
  ascent: number;
  descent: number;
  width: number;
}
