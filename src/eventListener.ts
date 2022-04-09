import { Text } from "./text";

export function mouseMove(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  textList: Text[]
) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  for (let i = 0; i < textList.length; i++) {
    const { left, top, width, height } = textList[i];
    if (x >= left && x <= left + width && y >= top && y <= top + height) {
      canvas.style.cursor = "text";
      return;
    } else {
      canvas.style.cursor = "default";
    }
  }
}
