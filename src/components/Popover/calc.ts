import { PopoverPosition } from './';

/**
 * @description 获取弹框元素的绝对位置及transform原点
 * @param triggerRect 触发弹框元素的rect信息
 * @param popWidth 弹框宽度
 * @param popHeight 弹框高度
 * @param position 弹框相对于触发元素的位置
 * @param distance 弹框和触发元素之间的距离
 */
export const calcPopover = (
  triggerRect: Partial<ClientRect>,
  popWidth: number,
  popHeight: number,
  position: PopoverPosition,
  distance: number,
) => {
  const { top = 0, left = 0, height = 0, width = 0 } = triggerRect;
  let _top: number = 0,
    _left: number = 0,
    _transformOrigin: string = '';

  switch (position) {
    case 'left-top':
      _top = top;
      _left = left - popWidth;
      _transformOrigin = 'right top';
      break;
    case 'left':
      _top = top - (1 / 2) * (popHeight - height);
      _left = left - popWidth;
      _transformOrigin = 'right center';
      break;
    case 'left-bottom':
      _top = top - (popHeight - height);
      _left = left - popWidth;
      _transformOrigin = 'right bottom';
      break;
    case 'top-left':
      _top = top - popHeight;
      _left = left;
      _transformOrigin = 'left bottom';
      break;
    case 'top':
      _top = top - popHeight;
      _left = left - (1 / 2) * (popWidth - width);
      _transformOrigin = 'center bottom';
      break;
    case 'top-right':
      _top = top - popHeight;
      _left = left - (popWidth - width);
      _transformOrigin = 'right bottom';
      break;
    case 'right-top':
      _top = top;
      _left = left + width;
      _transformOrigin = 'left top';
      break;
    case 'right':
      _top = top - (1 / 2) * (popHeight - height);
      _left = left + width;
      _transformOrigin = 'left center';
      break;
    case 'right-bottom':
      _top = top - (popHeight - height);
      _left = left + width;
      _transformOrigin = 'left bottom';
      break;
    case 'bottom-left':
      _top = top + height;
      _left = left;
      _transformOrigin = 'left top';
      break;
    case 'bottom':
      _top = top + height;
      _left = left - (1 / 2) * (popWidth - width);
      _transformOrigin = 'center top';
      break;
    case 'bottom-right':
      _top = top + height;
      _left = left - (popWidth - width);
      _transformOrigin = 'right top';
      break;
    default:
      break;
  }

  const splited = position.split('-')[0];
  switch (splited) {
    case 'left':
      _left = _left - distance;
      break;
    case 'top':
      _top = _top - distance;
      break;
    case 'right':
      _left = _left + distance;
      break;
    case 'bottom':
      _top = _top + distance;
      break;
    default:
      break;
  }

  return { top: _top, left: _left, transformOrigin: _transformOrigin };
};
