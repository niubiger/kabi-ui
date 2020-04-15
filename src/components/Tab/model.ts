import { ElimateUnitAsNumber, genReducer } from '../../utils';
import { Action, Reducers } from '../../utils/types';

const reducers: Reducers = {
  setCurrent(state, { payload: { current } }) {
    return { ...state, current };
  },
  setTabLineWidth(state, { payload: { tabLineWidth, children } }) {
    const { current } = state;
    if (tabLineWidth !== 'auto') {
      return { ...state, dyTabLineWidth: tabLineWidth };
    } else {
      const { width } = (children[current] as HTMLAnchorElement).getBoundingClientRect();
      const { paddingLeft, paddingRight } = getComputedStyle(
        (children[current] as HTMLAnchorElement).children[0] as HTMLSpanElement,
      );
      return {
        ...state,
        dyTabLineWidth:
          width - ElimateUnitAsNumber(paddingLeft, 'px') - ElimateUnitAsNumber(paddingRight, 'px'),
      };
    }
  },
  setMoveDistance(state, { payload: { tabLineWidth, children } }) {
    const { current, dyTabLineWidth } = state;
    if (tabLineWidth !== 'auto') {
      let distance =
        ((children[0] as HTMLAnchorElement).getBoundingClientRect().width -
          (dyTabLineWidth as number)) /
        2;
      for (let i = 1; i < current + 1; i += 1) {
        const childWidth = (children[i] as HTMLAnchorElement).getBoundingClientRect().width;
        const lastChildWidth = (children[i - 1] as HTMLAnchorElement).getBoundingClientRect().width;
        const d = (childWidth + lastChildWidth) / 2;
        distance += d;
      }
      return { ...state, moveDistance: distance };
    } else {
      const { paddingLeft: firstPaddingLeft } = getComputedStyle(
        (children[0] as HTMLAnchorElement).children[0] as HTMLSpanElement,
      );
      let distance = ElimateUnitAsNumber(firstPaddingLeft, 'px');
      for (let i = 1; i < current + 1; i += 1) {
        const lastChildWidth = (children[i - 1] as HTMLAnchorElement).getBoundingClientRect().width;
        distance += lastChildWidth;
      }
      return { ...state, moveDistance: distance };
    }
  },
  setContentWidth(state, { payload: { width } }) {
    return { ...state, contentWidth: width };
  },
};

export default {
  initState: {
    current: 0,
    moveDistance: 0,
    dyTabLineWidth: 0,
    contentWidth: 0,
  },
  reducer(state: any, action: Action) {
    return genReducer(reducers, state, action);
  },
};
