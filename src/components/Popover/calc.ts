import { PopoverPosition } from './';

type TriggerRect = {
  offsetTop: number;
  offsetLeft: number;
  top: number;
  left: number;
  height: number;
  width: number;
};

/**
 * @description 获取弹框元素的绝对位置及transform原点
 * @param triggerRect 触发弹框元素的rect信息
 * @param popWidth 弹框宽度
 * @param popHeight 弹框高度
 * @param position 弹框相对于触发元素的位置
 * @param distance 弹框和触发元素之间的距离
 */
export const calcPopover = (
  triggerRect: TriggerRect,
  popWidth: number,
  popHeight: number,
  position: PopoverPosition,
  distance: number,
) => {
  const { offsetTop = 0, offsetLeft = 0, top = 0, left = 0, height = 0, width = 0 } = triggerRect;
  let _top: number = 0,
    _left: number = 0,
    _transformOrigin: string = '';

  // 不考虑边界时的位置
  switch (position) {
    case 'left-top':
      _top = offsetTop;
      _left = offsetLeft - popWidth;
      _transformOrigin = 'right top';
      break;
    case 'left':
      _top = offsetTop - (1 / 2) * (popHeight - height);
      _left = offsetLeft - popWidth;
      _transformOrigin = 'right center';
      break;
    case 'left-bottom':
      _top = offsetTop - (popHeight - height);
      _left = offsetLeft - popWidth;
      _transformOrigin = 'right bottom';
      break;
    case 'top-left':
      _top = offsetTop - popHeight;
      _left = offsetLeft;
      _transformOrigin = 'left bottom';
      break;
    case 'top':
      _top = offsetTop - popHeight;
      _left = offsetLeft - (1 / 2) * (popWidth - width);
      _transformOrigin = 'center bottom';
      break;
    case 'top-right':
      _top = offsetTop - popHeight;
      _left = offsetLeft - (popWidth - width);
      _transformOrigin = 'right bottom';
      break;
    case 'right-top':
      _top = offsetTop;
      _left = offsetLeft + width;
      _transformOrigin = 'left top';
      break;
    case 'right':
      _top = offsetTop - (1 / 2) * (popHeight - height);
      _left = offsetLeft + width;
      _transformOrigin = 'left center';
      break;
    case 'right-bottom':
      _top = offsetTop - (popHeight - height);
      _left = offsetLeft + width;
      _transformOrigin = 'left bottom';
      break;
    case 'bottom-left':
      _top = offsetTop + height;
      _left = offsetLeft;
      _transformOrigin = 'left top';
      break;
    case 'bottom':
      _top = offsetTop + height;
      _left = offsetLeft - (1 / 2) * (popWidth - width);
      _transformOrigin = 'center top';
      break;
    case 'bottom-right':
      _top = offsetTop + height;
      _left = offsetLeft - (popWidth - width);
      _transformOrigin = 'right top';
      break;
    default:
      break;
  }

  // 考虑distance
  // TODO: 考虑边界
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
