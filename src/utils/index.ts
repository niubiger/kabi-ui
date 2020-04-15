import { Reducers, Action } from './types';

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

export const getOffset = (ele: IElement, target: HTMLElement = document.body): Offset => {
  let [offsetTop, offsetLeft] = [0, 0];

  do {
    if (ele) {
      offsetTop += ele.offsetTop;
      offsetLeft += ele.offsetLeft;
      ele = ele.offsetParent;
    }
  } while (ele && ele !== target);

  return { top: offsetTop, left: offsetLeft };
};

export function isArrayNotEmpty(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

export function ElimateUnitAsNumber(str: string, unit: string): number {
  return Number(str.replace(new RegExp(unit, 'g'), ''));
}

export function genReducer(reducers: Reducers, state: any, action: Action) {
  if (Object.prototype.hasOwnProperty.call(reducers, action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
}
