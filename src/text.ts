import { setCtxOptions, setTextPos, searchWordBreak } from "./utils";
import { clipboard } from "./utils/clipboard";

export function renderTexts(
  ctx: C2D,
  texts: TextConfig[],
  start: number,
  end: number
) {
  for (let j = start; j <= end; j++) {
    const text = texts[j];
    setCtxOptions(ctx, text.options);
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      text.left,
      text.top - text.ascent,
      text.width,
      text.ascent + text.descent
    );
    ctx.fillText(text.text, text.left, text.top);
  }
}

function wordBreak(ctx: C2D, texts: TextConfig[], index: number): number {
  const text = texts[index];
  let wudth = ctx.canvas.width - text.left;
  let textRightPos = searchWordBreak(ctx, wudth, text.text);
  if (textRightPos === 0) {
    text.left = 0;
    return textRightPos;
  }
  let nextLineText = JSON.parse(JSON.stringify(text));
  nextLineText.text = nextLineText.text.substring(textRightPos);
  nextLineText.left = 0;
  texts.splice(index + 1, 0, nextLineText);
  text.text = text.text.substring(0, textRightPos);
  text.width = ctx.measureText(text.text).width;
  return textRightPos;
}

export function initPos(ctx: C2D, texts: TextConfig[]) {
  let start = 0;
  let left = 0;
  let curLineTop = 0;
  let maxAscent = 0;
  let lineHeight = 0;
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    setCtxOptions(ctx, text.options);
    let { ascent, descent, width } = setTextPos(ctx, text, left);
    if (left + width < ctx.canvas.width) {
      lineHeight = Math.max(ascent + descent, lineHeight);
      maxAscent = Math.max(ascent, maxAscent);
      left = left + width;
      continue;
    }
    let breakindex = wordBreak(ctx, texts, i);
    if (breakindex === 0) {
      text.top = curLineTop + lineHeight + ascent;
      for (let j = start; j <= i - 1; j++) {
        texts[j].top = curLineTop + maxAscent;
      }
      start = i;
      left = width;
      curLineTop = curLineTop + lineHeight;
      lineHeight = ascent + descent;
      maxAscent = ascent;
    } else {
      lineHeight = Math.max(ascent + descent, lineHeight);
      maxAscent = Math.max(ascent, maxAscent);
      texts[i + 1].top = curLineTop + lineHeight + ascent;
      for (let j = start; j <= i; j++) {
        texts[j].top = curLineTop + maxAscent;
      }
      start = i + 1;
      left = 0;
      curLineTop = curLineTop + lineHeight;
      lineHeight = ascent + descent;
      maxAscent = ascent;
    }
  }
  // last line
  for (let i = start + 1; i < texts.length; i++) {
    texts[i].top = curLineTop + maxAscent;
  }
  renderTexts(ctx, texts, 0, texts.length - 1);
}

export function getClickText(
  texts: TextConfig[],
  x: number,
  y: number
): { text: TextConfig | null; index: number } {
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    let { left, width, top, ascent, descent } = text;
    if (
      x >= left &&
      x <= left + width &&
      y >= top - ascent &&
      y <= top + descent
    ) {
      return { text, index: i };
    }
  }
  return { text: null, index: -1 };
}

export function selectText(
  ctx: C2D,
  tc: TC[],
  i: IBlinkingData,
  j: IBlinkingData
) {
  if (i.index > j.index) [i, j] = [j, i];
  if (i.left === undefined || j.left === undefined || i.left < 0 || j.left < 0)
    return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "rgb(199, 208, 215)";
  let selected = ""; // selected text
  if (i.index === j.index) {
    selected = i.text.text.slice(
      Math.min(i.textIndex, j.textIndex) + 1,
      Math.max(i.textIndex, j.textIndex) + 1
    );
    clipboard.setData(selected);
    ctx.fillRect(i.left, i.top, j.left - i.left, i.height);
    renderTexts(ctx, tc, 0, tc.length - 1);
    return;
  }
  // same line but not same text
  if (i.textTop === j.textTop) {
    selected = i.text.text.slice(i.textIndex + 1);
    let y = i.top;
    let h = i.height;
    for (let i_k = i.index + 1; i_k <= j.index; i_k++) {
      if (i_k === j.index) {
        selected += tc[i_k].text.slice(0, j.textIndex + 1);
      } else {
        selected += tc[i_k].text;
      }
      y = Math.min(y, tc[i_k].top - tc[i_k].ascent);
      h = Math.max(h, tc[i_k].ascent + tc[i_k].descent);
    }
    ctx.fillRect(i.left, y, j.left - i.left, h);
  } else {
    selected = i.text.text.slice(i.textIndex + 1);
    let h = i.height;
    let y = i.top;
    let r = 0;
    let l = 0;
    let i_k = i.index;
    let j_k = j.index;
    // to the end of line
    for (; i_k < tc.length && tc[i_k].top === i.textTop; i_k++) {
      const text = tc[i_k];
      if (i_k > i.index) selected += text.text;
      h = Math.max(h, text.ascent + text.descent);
      y = Math.min(y, text.top - text.ascent);
      r = text.left + text.width;
    }
    ctx.fillRect(i.left, y, r - i.left, h);
    h = j.height;
    y = j.top;
    let endSelected = j.text.text.slice(0, j.textIndex + 1);
    // to the start of line
    for (; tc[j_k].top === j.textTop; j_k--) {
      if (j_k > j.index) endSelected = tc[j_k].text + endSelected;
      h = Math.max(h, tc[j_k].ascent + tc[j_k].descent);
      y = Math.min(y, tc[j_k].top - tc[j_k].ascent);
      l = tc[j_k].left;
    }
    ctx.fillRect(l, y, j.left - l, h);
    h = tc[i_k].ascent + tc[i_k].descent;
    l = tc[i_k].left;
    y = tc[i_k].top;
    r = tc[i_k].left + tc[i_k].width;
    for (; i_k <= j_k; i_k++) {
      selected += tc[i_k].text;
      h = Math.max(h, tc[i_k].ascent + tc[i_k].descent);
      y = Math.min(y, tc[i_k].top - tc[i_k].ascent);
      r = tc[i_k].left + tc[i_k].width;
      if (tc[i_k].top !== tc[i_k + 1].top) {
        ctx.fillRect(l, y, r - l, h);
        h = tc[i_k + 1].ascent + tc[i_k + 1].descent;
        l = tc[i_k + 1].left;
        y = tc[i_k + 1].top;
        r = tc[i_k + 1].left + tc[i_k + 1].width;
      }
    }
    selected += endSelected;
  }
  clipboard.setData(selected);
  renderTexts(ctx, tc, 0, tc.length - 1);
}
