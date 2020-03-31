/**
 * @description 获取DOM元素距离顶部高度
 * @param ele DOM元素
 */

export interface IElement extends HTMLElement {
  offsetTop: number;
  offsetLeft: number;
  offsetParent: IElement;
}

type Offset = {
  top: number;
  left: number;
};

export const getOffset = (ele: IElement): Offset => {
  let [offsetTop, offsetLeft] = [0, 0];
  do {
    if (ele !== null) {
      offsetTop += ele.offsetTop;
      offsetLeft += ele.offsetLeft;
      ele = ele.offsetParent;
    }
  } while (ele);

  return { top: offsetTop, left: offsetLeft };
};
