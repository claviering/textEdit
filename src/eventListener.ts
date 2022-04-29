import { setCtxOptions } from "./utils";
import { getClickText } from "./text";

// function hoverBorder(canvas: HTMLCanvasElement, x: number, y: number): boolean {
//   let cw = canvas.width;
//   let ch = canvas.height;
//   let r = 3;
//   if ((y < r || y > ch - r) && x > r && x < cw - r) {
//     // top or bottom border
//     canvas.style.cursor = "ns-resize";
//     return true;
//   } else if ((x < r || x > cw - r) && y > r && y < ch - r) {
//     // left or right border
//     canvas.style.cursor = "ew-resize";
//     return true;
//   } else if ((x < r && y < r) || (x > cw - r && y > ch - r)) {
//     // top left or bottom right
//     canvas.style.cursor = "nwse-resize";
//     return true;
//   } else if ((x > cw - r && y < r) || (x < r && y > ch - r)) {
//     // top right or bottom left
//     canvas.style.cursor = "nesw-resize";
//     return true;
//   } else {
//     return false;
//   }
// }

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

export function mouseMove(e: ME, canvas: CE, textList: TextPOS[]) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  // if (hoverBorder(canvas, x, y)) return;
  hoverText(canvas, textList, x, y);
}

export function addBlinking(
  e: ME,
  canvas: CE,
  ctx: C2D | null,
  textConfig: TextConfig[]
) {
  let blinking = document.querySelector(".blinking-cursor") as HTMLDivElement;
  if (!blinking || canvas.style.cursor !== "text") return;
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let clickText = getClickText(textConfig, x, y);
  if (!clickText || !ctx) {
    return;
  }
  let blinkingLeft = x;
  setCtxOptions(ctx, clickText.options);
  let textLeftPos = clickText.left;
  let textRightPos = clickText.left;
  for (let i = 0; i < clickText.text.length; i++) {
    const textMetrics = ctx.measureText(clickText.text[i]);
    textRightPos = textLeftPos + textMetrics.width;
    let leftDir = x - textLeftPos;
    let rightDir = textRightPos - x;
    if (textLeftPos > x || x > textRightPos) {
      textLeftPos = textRightPos;
      continue;
    }
    if (leftDir < rightDir) {
      blinkingLeft = textLeftPos;
      break;
    } else if (leftDir > rightDir) {
      blinkingLeft = textRightPos;
      break;
    } else if (leftDir === rightDir) {
      blinkingLeft = textLeftPos;
      break;
    }
  }
  let height = clickText.ascent + clickText.descent;
  let top = clickText.top - clickText.ascent;
  blinking.style.left = `${blinkingLeft}px`;
  blinking.style.top = `${top}px`;
  blinking.style.height = `${height}px`;
}
