import "./style.css";
import { mouseMove, addBlinking } from "./eventListener";
import { renderLine } from "./text";
import { textData } from "./mock";

function render(textConfig: TextConfig[]) {
  let app = document.querySelector("#canvas");
  if (!app) return;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = app.clientWidth;
  canvas.height = app.clientHeight;
  canvas.addEventListener("click", function (e: MouseEvent) {
    addBlinking(e, canvas, ctx, textConfig);
  });
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouseMove(e, canvas, textConfig);
  });
  app.appendChild(canvas);

  renderLine(ctx, textConfig);
}

render(textData);
