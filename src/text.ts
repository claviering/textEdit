import { setCtxOptions, setTextPos, searchWordBreak } from "./utils";

function renderTexts(
  ctx: C2D,
  texts: TextConfig[],
  start: number,
  end: number,
  top: number
) {
  for (let j = start; j <= end; j++) {
    const text = texts[j];
    setCtxOptions(ctx, text.options);
    text.top = top;
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

function wordBreak(ctx: C2D, texts: TextConfig[], index: number) {
  const text = texts[index];
  let wudth = ctx.canvas.width - text.left;
  let textRightPos = searchWordBreak(ctx, wudth, text.text);
  let nextLineText = JSON.parse(JSON.stringify(text));
  nextLineText.text = nextLineText.text.substring(textRightPos);
  nextLineText.left = 0;
  texts.splice(index + 1, 0, nextLineText);
  text.text = text.text.substring(0, textRightPos);
}

export function renderLine(ctx: C2D, texts: TextConfig[]) {
  let start = 0;
  let left = 0;
  let curLineTop = 0;
  let maxAscent = 0;
  let lineHeight = 0;
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    setCtxOptions(ctx, text.options);
    let { ascent, descent, width } = setTextPos(ctx, text, left);
    lineHeight = Math.max(ascent + descent, lineHeight);
    maxAscent = Math.max(ascent, maxAscent);
    if (left + width > ctx.canvas.width) {
      wordBreak(ctx, texts, i);
      renderTexts(ctx, texts, start, i, curLineTop + maxAscent);
      curLineTop = curLineTop + lineHeight;
      lineHeight = 0;
      start = i + 1;
      left = 0;
      maxAscent = 0;
      continue;
    }
    left = left + width;
  }
  // last line
  renderTexts(ctx, texts, start, texts.length - 1, curLineTop + maxAscent);
}

export function getClickText(
  texts: TextConfig[],
  x: number,
  y: number
): TextConfig | null {
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    let { left, width, top, ascent, descent } = text;
    if (
      x >= left &&
      x <= left + width &&
      y >= top - ascent &&
      y <= top + descent
    ) {
      return text;
    }
  }
  return null;
}
