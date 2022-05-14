import { setCtxOptions } from "./utils";
import { getClickText, selectText, renderTexts } from "./text";
import { clipboard } from "./utils/clipboard";

let selectTextPos: SelectTextPos = {
  selecting: false,
  count: 0,
  i: {} as IBlinkingData,
};

function cleanSelectText(
  canvas: CE,
  ctx: C2D | null,
  selectTextPos: SelectTextPos,
  textConfig: TextConfig[]
) {
  if (ctx && selectTextPos.count === 2 && !selectTextPos.selecting) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectTextPos.count = 0;
    renderTexts(ctx, textConfig, 0, textConfig.length - 1);
    clipboard.clear();
  }
}

export function bindEven(canvas: CE, ctx: C2D, textConfig: TC[]) {
  canvas.addEventListener("click", function (e: MouseEvent) {
    addBlinking(e, canvas, ctx, textConfig);
    cleanSelectText(canvas, ctx, selectTextPos, textConfig);
    selectTextPos.count = 2;
  });
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouseMove(e, canvas, textConfig);
    let selecting = selectTextPos.selecting;
    if (selecting && ctx) {
      let j = handleSelectText(e, ctx, textConfig);
      selectText(ctx, textConfig, selectTextPos.i, j);
    }
  });
  canvas.addEventListener("mousedown", function (e: MouseEvent) {
    cleanSelectText(canvas, ctx, selectTextPos, textConfig);
    selectTextPos.selecting = true;
    selectTextPos.i = handleSelectText(e, ctx, textConfig);
  });
  canvas.addEventListener("mouseup", function () {
    selectTextPos.selecting = false;
  });
  window.addEventListener("keydown", function (e: KeyboardEvent) {
    var ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && e.code === "KeyC") {
      navigator.clipboard.writeText(clipboard.get());
      clipboard.clear();
    }
    e.preventDefault();
    return false;
  });
}

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

function mouseMove(e: ME, canvas: CE, textList: TC[]) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  // if (hoverBorder(canvas, x, y)) return;
  hoverText(canvas, textList, x, y);
}

function getBlinkingPos(
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
  let i = 0;
  for (i = 0; i < text.text.length; i++) {
    const textMetrics = ctx.measureText(text.text[i]);
    textRightPos = textLeftPos + textMetrics.width;
    let leftDir = x - textLeftPos;
    let rightDir = textRightPos - x;
    if (textLeftPos > x || x > textRightPos) {
      textLeftPos = textRightPos;
      continue;
    }
    if (leftDir < rightDir) {
      i = i - 1;
      left = textLeftPos;
      break;
    } else if (leftDir > rightDir) {
      left = textRightPos;
      break;
    } else if (leftDir === rightDir) {
      i = i - 1;
      left = textLeftPos;
      break;
    }
  }
  let height = text.ascent + text.descent;
  let top = text.top - text.ascent;
  return { left, top, height, textTop: text.top, text, index, textIndex: i };
}

function addBlinking(e: ME, canvas: CE, ctx: C2D | null, textConfig: TC[]) {
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

function handleSelectText(e: ME, ctx: C2D, textConfig: TC[]): IBlinkingData {
  if (ctx.canvas.style.cursor !== "text") return {} as IBlinkingData;
  let rect = ctx.canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  return getBlinkingPos(ctx, textConfig, x, y);
}
