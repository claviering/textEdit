import "./style.css";
import { renderText, Text } from "./text";
import { mouseMove } from "./eventListener";

function render() {
  let canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  let textList: Text[] = [];
  canvas.addEventListener("mousemove", (e: MouseEvent) =>
    mouseMove(e, canvas, textList)
  );
  document.body.appendChild(canvas);
  let ctx = canvas.getContext("2d");
  if (!ctx) return;
  textList.push(renderText(ctx, "abg", 0, 16), renderText(ctx, "abg", 100, 16));
}

render();
