import React, { FC, useState, MouseEvent, CSSProperties } from 'react';
import theme from '../../config/theme';
import { ButtonSize, ButtonType } from './local';
import { css } from '@emotion/core';
import './index.scss';
import './index.scss';
export interface ButtonProps {
  /**
   * 按钮风格类型
   * @default 'primary'
   */
  type?: ButtonType;
  /**
   * 按钮尺寸(large,middle,small)
   * @default 'small'
   */
  size?: ButtonSize;
  /**
   * 包裹元素的样式
   */
  outerStyle?: CSSProperties;
  /**
   * 是否开启鼠标跟随聚焦(默认开启)
   * @default true
   */
  follow?: boolean;
}
const clsPrefix = `${theme['global-prefix']}-button`;
const Button: FC<ButtonProps> = ({
  type = 'primary',
  follow = true,
  size = 'small',
  outerStyle = {},
  children,
  ...props
}) => {
  const [flashCenter, setFlashCenter] = useState<number[] | null>(null);
  function followMouse(e: MouseEvent) {
    const { offsetX, offsetY } = e.nativeEvent;
    setFlashCenter([offsetX, offsetY]);
  }
  function cancelFollow() {
    setFlashCenter(null);
  }

  return (
    <button
      {...props}
      className={`${clsPrefix}-outer ${clsPrefix}-${size} 
    ${clsPrefix}-${type}`}
      onMouseMove={followMouse}
      onMouseLeave={cancelFollow}
      css={
        follow && flashCenter
          ? css`
              background-image: radial-gradient(
                circle closest-corner at ${flashCenter[0]}px ${flashCenter[1]}px,
                rgba(255, 255, 255, 0.4),
                rgba(255, 255, 255, 0.1)
              );
            `
          : null
      }
      style={outerStyle}
    >
      {children}
    </button>
  );
};

export default Button;
