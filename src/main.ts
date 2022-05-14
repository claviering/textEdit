import "./style.css";
import { bindEven } from "./eventListener";
import { initPos } from "./text";
import { textData } from "./mock";

function render(textConfig: TextConfig[]) {
  let app = document.querySelector("#canvas");
  if (!app) return;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d")!;
  if (!ctx) return;
  canvas.width = app.clientWidth;
  canvas.height = app.clientHeight;

  bindEven(canvas, ctx, textConfig);
  app.appendChild(canvas);
  initPos(ctx, textConfig);
  ctx.globalCompositeOperation = "source-over";
}

render(textData);
