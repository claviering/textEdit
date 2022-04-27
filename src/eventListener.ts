export function mouseMove(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  textList: TextPOS[]
) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  for (let i = 0; i < textList.length; i++) {
    const { left, top, width, ascent, descent } = textList[i];
    if (
      x >= left &&
      x <= left + width &&
      y >= top - ascent &&
      y <= top + descent
    ) {
      canvas.style.cursor = "text";
      return;
    } else {
      canvas.style.cursor = "default";
    }
  }
}
