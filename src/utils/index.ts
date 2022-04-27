import { DEFAULT_TEXT_OPTIONS } from "../constants";

export function searchWordBreak(ctx: C2D, maxWidth: number, text: string) {
  let left = 0;
  let right = text.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let sub = text.substring(0, mid);
    const textMetrics = ctx.measureText(sub);
    if (textMetrics.width > maxWidth) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left - 1;
}

export function setCtxOptions(ctx: C2D, options: TextOptions | undefined) {
  options = Object.assign({}, DEFAULT_TEXT_OPTIONS, options);
  for (const key in options) {
    // @ts-ignore
    ctx[key] = options[key];
  }
}

export function setTextPos(
  ctx: C2D,
  textConfig: TextConfig,
  left: number
): ISetTextConfig {
  const textMetrics = ctx.measureText(textConfig.text);
  const ascent = textMetrics.fontBoundingBoxAscent;
  const descent = textMetrics.fontBoundingBoxDescent;
  textConfig.ascent = ascent;
  textConfig.descent = descent;
  textConfig.width = textMetrics.width;
  textConfig.left = left;
  return { ascent, descent, width: textMetrics.width };
}
