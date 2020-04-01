import React, {
  FC,
  ReactElement,
  useState,
  useRef,
  useEffect,
  MouseEventHandler,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import theme from '../../config/theme';
import { getOffset, IElement } from '../../utils';
import { calcPopover } from './calc';
import './index.scss';

export type PopoverPosition =
  | 'left-top'
  | 'left'
  | 'left-bottom'
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export interface PopoverProps {
  /**
   * 触发 Popover 的元素
   */
  triggerElement: ReactElement;
  /**
   * Popover 出现的位置
   * @default 'top'
   */
  position?: PopoverPosition;
  /**
   * Popover 和 triggerElement 之间的距离
   * @default 4
   */
  distance?: number;
  /**
   * 容器
   * @default () => document.body;
   */
  container?: () => HTMLElement;
}

const clsPrefix = `${theme['global-prefix']}-popover`;

const Popover: FC<PopoverProps> = ({
  container = () => document.body,
  children,
  triggerElement,
  position = 'top',
  distance = 4,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();
    setShow(!show);
  };
  const _container = useMemo(() => container() || document.body, [container]);

  useEffect(() => {
    _container.style.position = 'relative';
    return () => {
      _container.style.position = 'static';
    };
  }, [_container]);

  useEffect(() => {
    if (show) {
      // 由于 popRef 进行了 transform 变化，所以要用 offsetHeight, offsetWidth 来获取宽高
      const popHeight = (popRef.current as HTMLDivElement).offsetHeight;
      const popWidth = (popRef.current as HTMLDivElement).offsetWidth;
      const { top: offsetTop, left: offsetLeft } = getOffset(
        (triggerRef.current as HTMLDivElement).children[0] as IElement,
        _container,
      );
      const {
        top,
        left,
        height,
        width,
      } = (triggerRef.current as HTMLDivElement).children[0].getBoundingClientRect();

      const { top: _top, left: _left, transformOrigin: _transformOrigin } = calcPopover(
        { top, left, height, width, offsetTop, offsetLeft },
        popWidth,
        popHeight,
        position,
        distance,
      );

      (popRef.current as HTMLDivElement).style.top = _top + 'px';
      (popRef.current as HTMLDivElement).style.left = _left + 'px';
      (popRef.current as HTMLDivElement).style.transformOrigin = _transformOrigin;
    }
  }, [show, position, distance, _container]);

  return (
    <>
      <div onClick={handleClick} ref={triggerRef} className={`${clsPrefix}-trigger-outer`}>
        {triggerElement}
      </div>
      {ReactDOM.createPortal(
        <div className={`${clsPrefix}-outer`}>
          <div
            ref={popRef}
            className={classNames(`${clsPrefix}-x`, { [`${clsPrefix}-x-show`]: show })}
          >
            {children}
          </div>
        </div>,
        _container,
      )}
    </>
  );
};

export default Popover;
