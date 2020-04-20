import React, {
  FC,
  useRef,
  useEffect,
  useReducer,
  Reducer,
  useCallback,
  MouseEventHandler,
  CSSProperties,
} from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import model from './model';
import theme from '../../config/theme';
import { Action } from '../../utils/types';
import './index.scss';
import { useResize } from '../../utils/hooks';

export interface SliderProps {
  /**
   * 非受控状态下，滑动条的值
   */
  defaultValue?: number;
  /**
   * 滑动条的值
   */
  value?: number;
  /**
   * 滑动条下限值
   * @default 0
   */
  min?: number;
  /**
   * 滑动条上限值
   * @default 100
   */
  max?: number;
  /**
   * 步长
   * @default 1
   */
  step?: number;
  /**
   * change事件，值改变时触发
   */
  onChange?: (val: number, e: MouseEvent) => void;
  /**
   * mouseup事件之后触发
   */
  onChangeCommited?: (val: number, e: MouseEvent) => void;
  /**
   * 是否不可用
   * @default false
   */
  disabled?: boolean;
  /**
   * 包裹元素的样式
   */
  outerStyle?: CSSProperties;
  /**
   * 额外样式类名
   */
  className?: string;
}

const clsPrefix = `${theme['global-prefix']}-slider`;

const Slider: FC<SliderProps> = ({
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeCommited,
  disabled = false,
  outerStyle,
  className,
}) => {
  const thumbRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer<Reducer<any, Action>>(model.reducer, model.initialState);

  const handleMouseDown = useCallback(() => {
    dispatch({ type: 'setMouseFlag', payload: { isMouseDown: true } });
  }, []);
  const handleMouseUp = useCallback(() => {
    dispatch({ type: 'setMouseFlag', payload: { isMouseDown: false } });
  }, []);

  const calcMove = useCallback(
    e => {
      dispatch({
        type: 'setMouseCoord',
        payload: { mouseCoord: { x: e.clientX, y: e.clientY }, e, onChange, onChangeCommited },
      });
    },
    [onChange, onChangeCommited],
  );
  const moveHandler = useCallback(throttle(calcMove, 100), [calcMove]);

  const handleRailClick: MouseEventHandler<HTMLSpanElement> = useCallback(
    e => {
      if (disabled) return;

      const thumb = thumbRef.current as HTMLSpanElement;
      const { left, top, width, height } = thumb.getBoundingClientRect();
      const isInRangeX = e.clientX >= left && e.clientX <= left + width;
      const isInRangeY = e.clientY >= top && e.clientY <= top + height;

      if (isInRangeX && isInRangeY) {
        // clicking on thumb dont trigger move event
        return;
      }

      calcMove(e);
    },
    [calcMove, disabled],
  );

  const getStartPosition = useCallback(() => {
    const rail = railRef.current as HTMLSpanElement;
    const { left, top, width, height } = rail.getBoundingClientRect();
    dispatch({ type: 'setStartPosition', payload: { railRect: { left, top, width, height } } });
  }, []);

  useEffect(() => {
    if (!disabled)
      dispatch({ type: 'calcProps', payload: { max, min, value, defaultValue, step } });
  }, [defaultValue, value, max, min, step, disabled]);

  useEffect(() => {
    const thumb = thumbRef.current as HTMLSpanElement;
    getStartPosition();

    thumb.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mouseup', handleMouseUp, true);

    return () => {
      thumb.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
    };
  }, []);

  useEffect(() => {
    if (!disabled) {
      if (state.isMouseDown) document.addEventListener('mousemove', moveHandler);
      else document.removeEventListener('mousemove', moveHandler);
      return () => {
        document.removeEventListener('mousemove', moveHandler);
      };
    }
  }, [moveHandler, state.isMouseDown, disabled]);

  useResize(() => {
    getStartPosition();
  }, 200);

  return (
    <span
      className={classNames(`${clsPrefix}-outer`, className, {
        [`${clsPrefix}-disabled`]: disabled,
      })}
      onClick={handleRailClick}
      style={outerStyle}
    >
      <span className={`${clsPrefix}-wrapper`}>
        <span className={`${clsPrefix}-rail`} ref={railRef} />
        <span className={`${clsPrefix}-track`} style={{ width: `${state.percent * 100}%` }} />
        <span
          className={`${clsPrefix}-thumb`}
          style={{ left: `${state.percent * 100}%` }}
          ref={thumbRef}
        />
        <input ref={inputRef} type="hidden" value={state.value} />
      </span>
    </span>
  );
};

export default Slider;
