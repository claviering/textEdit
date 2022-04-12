import { searchWordBreak, lastLineTop } from "./utils";

const FONT_SIZE = 24;

export const FONT_FAMILY = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

interface TextOptions {
  fillStyle?: string;
  font?: string;
  textAlign?: string;
  textBaseline?: string;
}

const defaultTextOptions: TextOptions = {
  fillStyle: "#000",
  font: `${FONT_SIZE}px ${FONT_FAMILY}`,
  textAlign: "start",
  textBaseline: "top",
};

export function renderText(
  ctx: C2D,
  text: string,
  left: number,
  top: number,
  textList: TextPOS[],
  options?: TextOptions
) {
  options = Object.assign({}, defaultTextOptions, options);
  for (const key in options) {
    // @ts-ignore
    ctx[key] = options[key];
  }
  const textMetrics = ctx.measureText(text);
  textList.push({
    left,
    top,
    width: textMetrics.width,
    height: textMetrics.fontBoundingBoxDescent,
  });
  if (textMetrics.width > ctx.canvas.width) {
    let textLeft = searchWordBreak(ctx, text);
    ctx.fillText(text.substring(0, textLeft), left, top);
    if (textLeft < text.length) {
      renderText(
        ctx,
        text.substring(textLeft),
        left,
        lastLineTop(textList),
        textList,
        options
      );
    }
  } else {
    ctx.fillText(text, left, top);
  }
}
