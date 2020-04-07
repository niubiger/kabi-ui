import React, {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useRef,
  InputHTMLAttributes,
  useEffect,
  useCallback,
} from 'react';
import classNames from 'classnames';
import theme from '../../config/theme';
import './index.scss';

export interface SwitchProps {
  /**
   * 当前选中状态
   * @default false
   */
  checked?: boolean;
  /**
   * change事件
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * 默认选中
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * 是否不可用
   * @default false
   */
  disabled?: boolean;
  /**
   * 其他 <input> 的原生属性
   */
  props?: InputHTMLAttributes<HTMLInputElement>;
}

const clsPrefix = `${theme['global-prefix']}-switch`;

const Switch: FC<SwitchProps> = ({
  checked: ckd,
  onChange,
  defaultChecked = false,
  disabled = false,
  ...props
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') onChange(e);
      setChecked(e.target.checked);
    },
    [onChange],
  );
  const handleClick = useCallback(() => {
    if (!disabled) {
      const inputEle = inputRef.current as HTMLInputElement;
      if (inputEle.checked !== !checked) {
        // 模拟点击，触发 input change 事件
        const setValue = (Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'checked',
        ) as PropertyDescriptor).set;
        (setValue as (v: any) => void).call(inputEle, !checked);
        const event = new Event('click', { bubbles: true });
        inputEle.dispatchEvent(event);
      }
    }
  }, [disabled, checked]);
  useEffect(() => {
    // 如果父组件传入了checked属性，则每次update都应该触发setChecked，所以没传deps
    if (ckd !== undefined) setChecked(ckd);
  });

  return (
    <span
      className={classNames(`${clsPrefix}-outer`, {
        [`${clsPrefix}-checked`]: checked,
        [`${clsPrefix}-disabled`]: disabled,
      })}
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
    >
      <span className={`${clsPrefix}-wrapper`}>
        <input
          {...props}
          ref={inputRef}
          className={`${clsPrefix}-x`}
          type="checkbox"
          checked={checked}
          value=""
          onChange={handleChange}
        />
        <span className={`${clsPrefix}-thumb`} />
      </span>
      <span className={`${clsPrefix}-track`} />
    </span>
  );
};

export default Switch;
