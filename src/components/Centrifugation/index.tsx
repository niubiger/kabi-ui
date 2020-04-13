import React, { FC, useState } from 'react';
import theme from '../../config/theme';
import { css } from '@emotion/core';
import './index.scss';
interface MenuItem {
  text: string;
  onClick?: () => void;
}
export interface CentrifugationProps {
  /**
   * 菜单中心文案
   */
  centerText: string;
  /**
   * 菜单中心半径
   * @default 30
   */
  centerRadius?: number;
  /**
   * 菜单数组(推荐最大长度6)
   * @default []
   */
  menuList: MenuItem[];
  /**
   * 菜单分布角度
   * @default 60
   */
  degree?: number;
  /**
   * 离心距离
   * @default 20
   */
  distance?: number;
  /**
   * 菜单分布角度是否均分(默认true)
   * @default true
   */
  even?: boolean;
  /**
   * 中心菜单点击事件
   */
  onCenterClick?: () => void;
}
const clsPrefix = `${theme['global-prefix']}-centrifugation`;
const Centrifugation: FC<CentrifugationProps> = ({
  centerText,
  centerRadius = 30,
  even = true,
  degree = 60,
  distance = 20,
  onCenterClick,
  menuList = [],
}) => {
  const [expand, setExpand] = useState(false);
  return (
    <div
      className={`${clsPrefix}-outer`}
      css={css`
        --degree: ${even ? 360 / menuList.length : degree}deg;
        --distance: ${distance}px;
        padding: ${2 * centerRadius + distance}px;
      `}
      onMouseLeave={() => {
        setExpand(false);
      }}
    >
      <div
        className={
          expand ? `${clsPrefix}-center ${clsPrefix}-center-expand` : `${clsPrefix}-center`
        }
        css={css`
          width: ${2 * centerRadius}px;
          height: ${2 * centerRadius}px;
          line-height: ${2 * centerRadius}px;
        `}
        onMouseEnter={() => {
          setExpand(true);
        }}
        onClick={() => {
          onCenterClick && onCenterClick();
        }}
      >
        {centerText}
        <ul
          className={`${clsPrefix}-menuList`}
          css={css`
            width: ${2 * centerRadius}px;
            height: ${2 * centerRadius}px;
          `}
        >
          {menuList.map(menu => {
            return (
              <li
                className={`${clsPrefix}-menuItem`}
                onClick={e => {
                  e.stopPropagation();
                  menu.onClick && menu.onClick();
                }}
                key={menu.text}
              >
                <span className={`${clsPrefix}-menuItem-text`}>{menu.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Centrifugation;
