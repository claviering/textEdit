interface TextOptions {
  fillStyle?: string;
  font?: string;
  textAlign?: string;
  textBaseline?: string;
}
const defaultTextOptions: TextOptions = {
  fillStyle: "#000",
  font: `16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  textAlign: "start",
  textBaseline: "top",
};
export interface Text {
  left: number;
  top: number;
  width: number;
  height: number;
}
export function renderText(
  ctx: CanvasRenderingContext2D,
  text: string,
  left: number,
  top: number,
  options?: TextOptions
): Text {
  options = Object.assign({}, defaultTextOptions, options);
  for (const key in options) {
    // @ts-ignore
    ctx[key] = options[key];
  }
  const textMetrics = ctx.measureText(text);
  ctx.fillText(text, left, top);
  return {
    left,
    top,
    width: textMetrics.width,
    height: textMetrics.fontBoundingBoxDescent,
  };
}

renderText;
