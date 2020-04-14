import React, { FC, useState, useEffect, ReactNode, CSSProperties } from 'react';
import theme from '../../config/theme';
import anime, { EasingOptions } from 'animejs';
import './index.scss';

export interface DanceNumberProps {
  /**
   *  起始数值
   * @default 0
   */
  startVal?: number | string;
  /**
   *  结束数值
   */
  endVal: number | string;
  /**
   *  动画持续时间(单位豪秒)
   * @default 1000
   */
  duration?: number;
  /**
   *  动画延迟时间(单位豪秒)
   * @default 0
   */
  delay?: number;
  /**
   *  显示千分位
   * @default false;
   */
  sep?: boolean;
  /**
   *  缓动效果
   * @default 'easeOutQuad'
   */
  easing?: EasingOptions;
  /**
   * 额外样式
   */
  style?: CSSProperties;
  /**
   * 起始或者结束数值是NaN替换展示内容
   * @default 'NaN'
   */
  replaceNaN?: ReactNode;
}
function transVal(val: string | number) {
  if (typeof val === 'string') {
    return parseFloat(val);
  } else {
    return val;
  }
}
const clsPrefix = `${theme['global-prefix']}-dancenumber`;
const DanceNumber: FC<DanceNumberProps> = ({
  startVal = 0,
  endVal,
  duration = 1000,
  delay = 0,
  sep = false,
  easing = 'easeOutQuad',
  style,
  replaceNaN = 'NaN',
}) => {
  let sValue = transVal(startVal);
  let eValue = transVal(endVal);
  if (isNaN(sValue) || isNaN(eValue)) {
    return <span className={`${clsPrefix}-outer`}>{replaceNaN}</span>;
  }

  const [tweenVal, setTweenVal] = useState<number | string>(sValue);
  const [lastVal, setLastVal] = useState(NaN);
  useEffect(() => {
    let decimalLen = (
      Number(eValue)
        .toString()
        .split('.')[1] || ''
    ).length;
    let target = {
      value: isNaN(lastVal) ? sValue : lastVal,
    };
    anime({
      targets: target,
      value: eValue,
      easing: easing,
      duration: duration,
      round: Math.pow(10, decimalLen),
      delay: isNaN(lastVal) ? delay : 0,
      update: function() {
        setTweenVal(sep ? target.value.toLocaleString() : target.value);
      },
      complete: function() {
        setLastVal(eValue);
      },
    });
  }, [sValue, lastVal, eValue, duration, easing, delay, sep]);
  return (
    <span className={`${clsPrefix}-outer`} style={style}>
      {tweenVal}
    </span>
  );
};
export default DanceNumber;
