import { getBlinkingPos, selectText, renderTexts, selectAllText } from "./text";
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
  window.addEventListener("click", function (e: MouseEvent) {
    if (e.target === canvas) {
      canvas.focus();
    } else {
      canvas.blur();
    }
  });
  window.addEventListener("keydown", function (e: KeyboardEvent) {
    if (document.activeElement !== canvas) return;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && e.code === "KeyC") {
      navigator.clipboard.writeText(clipboard.get());
      clipboard.clear();
    } else if (ctrlKey && e.code === "KeyA") {
      selectAllText(ctx, textConfig);
      navigator.clipboard.writeText(clipboard.get());
      clipboard.clear();
    }
    e.preventDefault();
    return false;
  });
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
