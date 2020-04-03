import React, {
  FC,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ReactChildren,
  CSSProperties,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { isArrayNotEmpty, ElimateUnitAsNumber } from '../../utils';
import { useResize } from '../../utils/hooks';
import theme from '../../config/theme';
import './index.scss';

export type Tab = {
  name: string;
  id: number | string;
  disabled?: boolean;
  style?: CSSProperties;
};
export type Tabs = Array<Tab>;

export type TabLineConfig = {
  width?: number | 'auto';
  thickness?: number;
};

export interface TabProps {
  /**
   * tab项
   *
   * type Tabs = Array<{ name: string; id: number | string; disabled?: boolean; style: React.CSSProperties }>
   *
   * name：tab名称
   *
   * id：唯一id
   *
   * disabled：tab是否不可用
   *
   * style: tab的自定义样式
   */
  tabs: Tabs;
  /**
   * 当前项
   * @default 0
   */
  current?: number;
  /**
   * tabchange 事件
   */
  onTabChange?: (current: number, item: Tab) => void;
  /**
   * tab 是否均布
   */
  equispaced: boolean;
  /**
   * 底部线条配置
   *
   * type TabLineConfig = { width?: number | 'auto'; thickness?: number }
   *
   * width：线条宽度，可为 number 或 'auto'
   *
   * thickness：线条粗细
   *
   * @default { width: 50, thickness: 2 }
   */
  tabLineConfig?: TabLineConfig;
  children: ReactChildren;
}

const clsPrefix = `${theme[`global-prefix`]}-tab`;

const Tab: FC<TabProps> = ({
  tabs,
  current: cur = 0,
  onTabChange,
  equispaced = false,
  tabLineConfig = { width: 50, thickness: 2 },
  children,
}) => {
  // --- tab variables ---
  const { width: tabLineWidth = 50, thickness = 2 } = useMemo(() => tabLineConfig, [tabLineConfig]);
  const [current, setCurrent] = useState(cur);
  const [moveDistance, setMoveDistance] = useState(0);
  const navRef = useRef<HTMLAnchorElement>(null);
  const [dyTabLineWidth, setDyTabLineWidth] = useState(tabLineWidth);
  // --- content variables ---
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // --- tab op START ---
  useEffect(() => {
    if (cur !== undefined && cur !== current) setCurrent(cur);
  }, [cur, current]);

  const calcDistance = useCallback(() => {
    const children = (navRef.current as HTMLElement).childNodes;
    if (children && children.length > 0) {
      // fixed tab line width
      if (tabLineWidth !== 'auto') {
        setDyTabLineWidth(tabLineWidth);
        let distance =
          ((children[0] as HTMLAnchorElement).getBoundingClientRect().width -
            (dyTabLineWidth as number)) /
          2;
        for (let i = 1; i < current + 1; i += 1) {
          const childWidth = (children[i] as HTMLAnchorElement).getBoundingClientRect().width;
          const lastChildWidth = (children[i - 1] as HTMLAnchorElement).getBoundingClientRect()
            .width;
          const d = (childWidth + lastChildWidth) / 2;
          distance += d;
        }
        setMoveDistance(distance);
        // dynamic tab line width
      } else {
        const { width } = (children[current] as HTMLAnchorElement).getBoundingClientRect();
        const { paddingLeft, paddingRight } = getComputedStyle(
          (children[current] as HTMLAnchorElement).children[0] as HTMLSpanElement,
        );
        setDyTabLineWidth(
          width - ElimateUnitAsNumber(paddingLeft, 'px') - ElimateUnitAsNumber(paddingRight, 'px'),
        );

        const { paddingLeft: firstPaddingLeft } = getComputedStyle(
          (children[0] as HTMLAnchorElement).children[0] as HTMLSpanElement,
        );
        let distance = ElimateUnitAsNumber(firstPaddingLeft, 'px');
        for (let i = 1; i < current + 1; i += 1) {
          const lastChildWidth = (children[i - 1] as HTMLAnchorElement).getBoundingClientRect()
            .width;
          distance += lastChildWidth;
        }
        setMoveDistance(distance);
      }
    }
  }, [current, dyTabLineWidth, tabLineWidth, equispaced]);

  useEffect(() => {
    calcDistance();
  }, [calcDistance]);

  function clickHandler() {
    const { idx, item } = this;
    if (!item.disabled) {
      setCurrent(idx);
      if (typeof onTabChange === 'function') onTabChange(idx, item);
    }
  }

  const handleTabClick = useCallback(debounce(clickHandler, 200), []);
  // --- tab op END ---

  // --- content op START ---
  const calcContentWidth = useCallback(() => {
    const { width } = (contentRef.current as HTMLDivElement).getBoundingClientRect();
    setContentWidth(width);
  }, []);

  useEffect(() => {
    calcContentWidth();
  }, [calcContentWidth]);
  // --- content op END ---

  // resize
  useResize(() => {
    calcDistance();
    calcContentWidth();
  }, 200);

  /* eslint jsx-a11y/anchor-is-valid:0 */
  return (
    <>
      <nav className={`${clsPrefix}-outer`} ref={navRef}>
        {isArrayNotEmpty(tabs) && (
          <>
            {tabs.map(({ id, name, style, ...rest }, idx) => (
              <a
                key={id}
                onClick={handleTabClick.bind({ idx, item: { id, name, style, ...rest } })}
              >
                <span
                  className={classNames(`${clsPrefix}-x`, {
                    [`${clsPrefix}-x-active`]: idx === current && !rest.disabled,
                    [`${clsPrefix}-x-equispaced`]: equispaced,
                    [`${clsPrefix}-x-disabled`]: rest.disabled,
                  })}
                  style={equispaced ? { ...style, width: `calc(100% / ${tabs.length})` } : style}
                >
                  {name}
                </span>
              </a>
            ))}
            <div
              className={`${clsPrefix}-line`}
              style={{
                width: dyTabLineWidth,
                height: thickness,
                transform: `translateX(${moveDistance}px)`,
              }}
            />
          </>
        )}
      </nav>
      <div className={`${clsPrefix}-contents`} ref={contentRef}>
        <div
          className={`${clsPrefix}-parts-container`}
          style={{ transform: `translateX(-${current * contentWidth}px)` }}
        >
          {React.Children.map(children, (child, idx) => (
            <div
              className={classNames(
                `${clsPrefix}-part`,
                idx === current ? `${clsPrefix}-part-active` : `${clsPrefix}-part-inactive`,
              )}
              style={{ width: `${contentWidth}px` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tab;
