import React, {
  FC,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ReactChildren,
  CSSProperties,
  useReducer,
  Reducer,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import model from './model';
import { isArrayNotEmpty } from '../../utils';
import { useResize } from '../../utils/hooks';
import { Action } from '../../utils/types';
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
  /**
   * tab容器的额外样式类名
   */
  tabClassName?: string;
  /**
   * 内容
   */
  children?: ReactChildren;
}

const clsPrefix = `${theme[`global-prefix`]}-tab`;

const Tab: FC<TabProps> = ({
  tabs,
  current: cur = 0,
  onTabChange,
  equispaced = false,
  tabLineConfig = { width: 50, thickness: 2 },
  tabClassName,
  children,
}) => {
  // --- tab variables ---
  const { width: tabLineWidth = 50, thickness = 2 } = useMemo(() => tabLineConfig, [tabLineConfig]);
  const navRef = useRef<HTMLAnchorElement>(null);
  // --- content variables ---
  const contentRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer<Reducer<any, Action>>(model.reducer, model.initState);

  // --- tab op START ---
  useEffect(() => {
    if (cur !== undefined && cur !== state.current)
      dispatch({ type: 'setCurrent', payload: { current: cur } });
  }, [cur]);

  const calcDistance = useCallback(() => {
    const children = (navRef.current as HTMLElement).childNodes;
    dispatch({ type: 'setTabLineWidth', payload: { tabLineWidth, children } });
    dispatch({ type: 'setMoveDistance', payload: { tabLineWidth, children } });
  }, [tabLineWidth, equispaced]);

  useEffect(() => {
    calcDistance();
  }, [calcDistance]);

  const clickHandler = useCallback(
    function() {
      const { idx, item } = this;
      if (!item.disabled) {
        dispatch({ type: 'setCurrent', payload: { current: idx } });
        calcDistance();
        if (typeof onTabChange === 'function') onTabChange(idx, item);
      }
    },
    [onTabChange, calcDistance],
  );

  const handleTabClick = useCallback(debounce(clickHandler, 200), [clickHandler]);
  // --- tab op END ---

  // --- content op START ---
  const calcContentWidth = useCallback(() => {
    const { width } = (contentRef.current as HTMLDivElement).getBoundingClientRect();
    dispatch({ type: 'setContentWidth', payload: { width } });
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
      <nav className={classNames(`${clsPrefix}-outer`, tabClassName)} ref={navRef}>
        {isArrayNotEmpty(tabs) && (
          <>
            {tabs.map(({ id, name, style, ...rest }, idx) => (
              <a
                key={id}
                onClick={handleTabClick.bind({ idx, item: { id, name, style, ...rest } })}
              >
                <span
                  className={classNames(`${clsPrefix}-x`, {
                    [`${clsPrefix}-x-active`]: idx === state.current && !rest.disabled,
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
                width: state.dyTabLineWidth,
                height: thickness,
                transform: `translateX(${state.moveDistance}px)`,
              }}
            />
          </>
        )}
      </nav>
      <div className={`${clsPrefix}-contents`} ref={contentRef}>
        {React.Children.count(children) > 0 && (
          <div
            className={`${clsPrefix}-parts-container`}
            style={{ transform: `translateX(-${state.current * state.contentWidth}px)` }}
          >
            {React.Children.map(children, (child, idx) => (
              <div
                className={classNames(
                  `${clsPrefix}-part`,
                  idx === state.current ? `${clsPrefix}-part-active` : `${clsPrefix}-part-inactive`,
                )}
                style={{ width: `${state.contentWidth}px` }}
              >
                {child}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Tab;
