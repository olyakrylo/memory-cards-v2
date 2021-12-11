export const flip = (
  element: HTMLElement,
  time: number,
  callback: Function
) => {
  element.style.transform = "scaleY(0)";
  setTimeout(() => {
    callback();
    element.style.transform = "none";
  }, 200);
};
