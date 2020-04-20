import { Action, Reducers } from '../../utils/types';
import { genReducer } from '../../utils';

const reducers: Reducers = {
  calcProps(state, { payload: { max, min, value, defaultValue, step } }) {
    const decimal = step.toString().split('.')[1];
    const decimalCount = decimal !== undefined ? decimal.length : 0;
    const times = Math.pow(10, decimalCount);
    let val = min;
    if (defaultValue !== undefined) val = defaultValue;
    if (value !== undefined) val = value;
    if (val > max) val = max;
    if (val < min) val = min;
    const [multiplyMin, multiplyMax, multiplyStep, multiplyValue] = [min, max, step, val].map(
      n => n * times,
    );
    const calcValue = Math.ceil((multiplyValue - multiplyMin) / multiplyStep) * multiplyStep;
    const percent = (calcValue - multiplyMin) / (multiplyMax - multiplyMin);
    return {
      ...state,
      percent,
      value: calcValue / times,
      calc: {
        ...state.calc,
        min: multiplyMin,
        max: multiplyMax,
        step: multiplyStep,
        times,
      },
    };
  },
  setStartPosition(state, { payload: { railRect } }) {
    return { ...state, railRect: { ...state.railRect, ...railRect } };
  },
  setMouseCoord(state, { payload: { mouseCoord, onChange, onChangeCommited, e } }) {
    // TODO: vertical Slider

    const { max, min, step, times } = state.calc;
    const realPercent = (mouseCoord.x - state.railRect.left) / state.railRect.width;
    const realCaclVal = realPercent * (max - min) + min;

    let val;
    if (realCaclVal > state.value * times + step / 2)
      val = Math.ceil((realCaclVal - min) / step) * step;
    else if (realCaclVal < state.value * times - step / 2)
      val = Math.floor((realCaclVal - min) / step) * step;
    else val = state.value * times;

    if (val > max) val = max;
    if (val < min) val = min;
    if (Object.is(val, -0)) val = 0;

    const per = (val - min) / (max - min);
    const realVal = val / times;

    if (typeof onChange === 'function' && realVal !== state.value) onChange(realVal, e);
    if (typeof onChangeCommited === 'function' && !state.isMouseDown) onChangeCommited(realVal, e);

    return {
      ...state,
      mouseCoord: { ...state.mouseCoord, ...mouseCoord },
      percent: per,
      value: realVal,
    };
  },
  setMouseFlag(state, { payload: { isMouseDown } }) {
    return { ...state, isMouseDown };
  },
};

export default {
  initialState: {
    railRect: { left: 0, top: 0, width: 0, height: 0 },
    mouseCoord: { x: 0, y: 0 },
    isMouseDown: false,
    percent: 0,
    value: undefined,
    calc: {},
  },
  reducer(state: any, action: Action) {
    return genReducer(reducers, state, action);
  },
};
