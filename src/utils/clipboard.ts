function initClipboard() {
  let data = "";
  function setData(text: string) {
    console.log("setData", text);
    data = text;
  }
  function clear() {
    data = "";
  }
  function get() {
    return data;
  }
  return {
    setData,
    clear,
    get,
  };
}

export const clipboard = initClipboard();
