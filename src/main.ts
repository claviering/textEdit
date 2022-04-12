import "./style.css";
import { renderText, FONT_FAMILY } from "./text";
import { mouseMove } from "./eventListener";
import { lastLineTop, appendLinePos } from "./utils";

let text =
  "Change mouse cursor style to text when hovering over the text. Add word-break. Render a text to a canvas. Render a text to a canvas";

function render() {
  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 500;
  let textList: TextPOS[] = [];
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouseMove(e, canvas, textList);
  });
  document.body.appendChild(canvas);
  let ctx = canvas.getContext("2d");
  if (!ctx) return;
  renderText(ctx, text, 0, 0, textList);
  // renderText(ctx, text, 0, lastLineTop(textList), textList, {
  //   fillStyle: "red",
  //   font: `32px ${FONT_FAMILY}`,
  // });
  // let appendLinePosResult = appendLinePos(textList);
  // renderText(
  //   ctx,
  //   text,
  //   appendLinePosResult.left,
  //   appendLinePosResult.top,
  //   textList
  // );
}

render();
