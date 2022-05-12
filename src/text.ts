import { setCtxOptions, setTextPos, searchWordBreak } from "./utils";

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
  textConfig: TC[],
  i: IBlinkingData,
  j: IBlinkingData
) {
  console.log(i.index, j.index);
  console.log(textConfig);
  if (i.index === j.index) {
    console.log("111");
    ctx.fillStyle = "rgb(199, 208, 215)";
    let w = Math.max(j.left, i.left) - Math.min(j.left, i.left);
    ctx.fillRect(0, i.top, w, i.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  // if (i.index > j.index) {
  //   [i, j] = [j, i];
  // }
}
