import "./style.css";
import { mouseMove, addBlinking, handleSelectText } from "./eventListener";
import { initPos, selectText } from "./text";
import { textData } from "./mock";

function cleanSelectText(
  canvas: CE,
  ctx: C2D | null,
  selectTextPos: SelectTextPos,
  textConfig: TextConfig[]
) {
  if (ctx && selectTextPos.count === 2 && !selectTextPos.selecting) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectTextPos.count = 0;
    // renderLine(ctx, textConfig);
  }
}

function render(textConfig: TextConfig[]) {
  let app = document.querySelector("#canvas");
  if (!app) return;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d")!;
  if (!ctx) return;
  canvas.width = app.clientWidth;
  canvas.height = app.clientHeight;
  let selectTextPos: SelectTextPos = {
    selecting: false,
    count: 0,
    i: {} as IBlinkingData,
  };
  canvas.addEventListener("click", function (e: MouseEvent) {
    addBlinking(e, canvas, ctx, textConfig);
    // cleanSelectText(canvas, ctx, selectTextPos, textConfig);
    // selectTextPos.count = 2;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    initPos(ctx, textConfig);
  });
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouseMove(e, canvas, textConfig);
    // let selecting = selectTextPos.selecting;
    // if (selecting && ctx) {
    //   let j = handleSelectText(e, ctx, textConfig);
    //   selectText(ctx, textConfig, selectTextPos.i, j);
    // }
  });
  // canvas.addEventListener("mousedown", function (e: MouseEvent) {
  //   cleanSelectText(canvas, ctx, selectTextPos, textConfig);
  //   let i = handleSelectText(e, ctx, textConfig);
  //   selectTextPos.selecting = true;
  //   selectTextPos.i = i;
  // });
  // canvas.addEventListener("mouseup", function () {
  //   selectTextPos.selecting = false;
  // });
  app.appendChild(canvas);
  initPos(ctx, textConfig);
  ctx.globalCompositeOperation = "source-over";
}

render(textData);
