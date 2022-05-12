import { setCtxOptions } from "./utils";
import { getClickText } from "./text";

function hoverText(canvas: CE, textList: TextPOS[], x: number, y: number) {
  for (let i = 0; i < textList.length; i++) {
    const { left, top, width, ascent, descent } = textList[i];
    if (x > left && x < left + width && y > top - ascent && y < top + descent) {
      canvas.style.cursor = "text";
      return;
    } else {
      canvas.style.cursor = "default";
    }
  }
}

export function mouseMove(e: ME, canvas: CE, textList: TC[]) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  // if (hoverBorder(canvas, x, y)) return;
  hoverText(canvas, textList, x, y);
}

export function getBlinkingPos(
  ctx: C2D | null,
  textConfig: TC[],
  x: number,
  y: number
): IBlinkingData {
  let left = -1;
  let { text, index } = getClickText(textConfig, x, y);
  if (!text || !ctx) {
    return {} as IBlinkingData;
  }
  setCtxOptions(ctx, text.options);
  let textLeftPos = text.left;
  let textRightPos = -1;
  for (let i = 0; i < text.text.length; i++) {
    const textMetrics = ctx.measureText(text.text[i]);
    textRightPos = textLeftPos + textMetrics.width;
    let leftDir = x - textLeftPos;
    let rightDir = textRightPos - x;
    if (textLeftPos > x || x > textRightPos) {
      textLeftPos = textRightPos;
      continue;
    }
    if (leftDir < rightDir) {
      left = textLeftPos;
      break;
    } else if (leftDir > rightDir) {
      left = textRightPos;
      break;
    } else if (leftDir === rightDir) {
      left = textLeftPos;
      break;
    }
  }
  let height = text.ascent + text.descent;
  let top = text.top - text.ascent;
  return { left, top, height, textTop: text.top, text, index };
}

export function addBlinking(
  e: ME,
  canvas: CE,
  ctx: C2D | null,
  textConfig: TC[]
) {
  if (!ctx) return;
  let blinking = document.querySelector(".blinking-cursor") as HTMLDivElement;
  if (!blinking || canvas.style.cursor !== "text") return;
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  const { left, top, height } = getBlinkingPos(ctx, textConfig, x, y);
  blinking.style.left = `${left}px`;
  blinking.style.top = `${top}px`;
  blinking.style.height = `${height}px`;
}

export function handleSelectText(
  e: ME,
  ctx: C2D,
  textConfig: TC[]
): IBlinkingData {
  if (ctx.canvas.style.cursor !== "text") return {} as IBlinkingData;
  let rect = ctx.canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  return getBlinkingPos(ctx, textConfig, x, y);
}
