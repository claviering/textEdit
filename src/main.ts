import "./style.css";
import { mouseMove } from "./eventListener";
import { renderLine } from "./text";
import { textData } from "./mock";

function render(textConfig: TextConfig[]) {
  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 500;
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouseMove(e, canvas, textConfig);
  });
  document.body.appendChild(canvas);
  let ctx = canvas.getContext("2d");
  if (!ctx) return;
  renderLine(ctx, textConfig);
}

render(textData);
