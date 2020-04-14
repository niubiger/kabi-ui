import React, { FC, useState, ReactNode } from 'react';
import theme from '../../config/theme';
import { css } from '@emotion/core';
import './index.scss';
interface MenuItem {
  menu: ReactNode;
  onClick?: () => void;
}
export interface CentrifugationProps {
  /**
   * 菜单中心文案
   */
  centerMenu: ReactNode;
  /**
   * 中心菜单半径
   * @default 30
   */
  centerRadius?: number;
  /**
   * 其他菜单半径
   * @default 30
   */
  menuRadius?: number;
  /**
   * 菜单数组(推荐最大长度6)
   * @default []
   */
  menuList: MenuItem[];
  /**
   * 菜单起始角度
   * @default 0
   */
  startAngle?: number;
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
  centerMenu,
  centerRadius = 30,
  menuRadius = 30,
  even = true,
  startAngle = 0,
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
        --centerRadius: ${centerRadius}px;
        --menuRadius: ${menuRadius}px;
        --startAngle: ${startAngle}deg;
        padding: ${2 * menuRadius + distance}px;
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
        {centerMenu}
        <ul
          className={`${clsPrefix}-menuList`}
          css={css`
            width: ${2 * menuRadius}px;
            height: ${2 * menuRadius}px;
          `}
        >
          {menuList.map((menu, idx) => {
            return (
              <li
                className={`${clsPrefix}-menuItem`}
                onClick={e => {
                  e.stopPropagation();
                  menu.onClick && menu.onClick();
                }}
                key={'Centrifugation_menu_' + idx}
              >
                <span className={`${clsPrefix}-menuItem-text`}>{menu.menu}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Centrifugation;
