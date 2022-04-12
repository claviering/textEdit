export function searchWordBreak(ctx: C2D, text: string) {
  let width = ctx.canvas.width;
  let left = 0;
  let right = text.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let sub = text.substring(0, mid);
    const textMetrics = ctx.measureText(sub);
    if (textMetrics.width > width) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left - 1;
}

// calc next line top position when word-break
export function lastLineTop(textList: TextPOS[]): number {
  if (!textList || !textList.length) return 0;
  let last = textList.length - 1;
  let top = textList[last].top;
  let nextTop = top + textList[last].height;
  for (let i = last - 1; i >= 0; i--) {
    const item = textList[i];
    if (item.top === top) {
      nextTop = Math.max(nextTop, item.top + item.height);
    }
  }
  return nextTop;
}

export function appendLinePos(textList: TextPOS[]): {
  left: number;
  top: number;
} {
  if (!textList || !textList.length) return { left: 0, top: 0 };
  let last = textList.length - 1;
  let top = textList[last].top;
  let left = textList[last].left + textList[last].width;
  return { left, top };
}
