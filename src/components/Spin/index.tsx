import React, { FC, CSSProperties } from 'react';
import theme from '../../config/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
export enum SpinSize {
  small,
  default,
  large,
}
export interface SpinProps {
  /**
   * 描述文案
   */
  tip?: string;
  /**
   * spin尺寸
   * @default default
   */
  size?: SpinSize;
  /**
   * 控制是否spin
   * @default true
   */
  loading?: boolean;
  /**
   * 调整spin颜色和尺寸
   */
  spinStyle?: CSSProperties;
  /**
   * 单独配置tip样式
   */
  tipStyle?: CSSProperties;
}
const clsPrefix = `${theme['global-prefix']}-spin`;
const Spin: FC<SpinProps> = ({
  tip,
  size = 'default',
  loading = true,
  spinStyle,
  tipStyle,
  children,
}) => {
  return (
    <div
      className={`${clsPrefix}-outer ${clsPrefix}-${size} ${clsPrefix}-${
        loading ? 'loading' : 'hide'
      } ${children ? clsPrefix + '-outside' : clsPrefix + '-inside'}`}
    >
      <div
        style={spinStyle}
        className={`${clsPrefix}-${children ? 'outside' : 'inside'}-spin ${clsPrefix}-${
          children ? 'outside' : 'inside'
        }-spin-${loading ? 'loading' : 'hide'}`}
      >
        <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-pulse" />
        {tip && (
          <div className={`${clsPrefix}-tip`} style={tipStyle}>
            {tip}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
export default Spin;
