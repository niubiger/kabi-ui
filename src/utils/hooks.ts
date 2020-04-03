import { useEffect } from 'react';
import throttle from 'lodash/throttle';

/**
 * @description resize时进行操作
 * @param {function} callback
 * @param {number} wait
 */
export function useResize(callback: EventListener, wait: number) {
  useEffect(() => {
    const throttled = throttle(callback, wait);
    window.addEventListener('resize', throttled);
    return () => {
      window.removeEventListener('resize', throttled);
    };
  }, [callback, wait]);
}
