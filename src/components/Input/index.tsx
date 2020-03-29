import React, { FC, ChangeEvent, useState, CSSProperties, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../../config/theme';
import './index.scss';

interface Target {
  value: string;
}
export interface InputProps {
  /**
   * 输入框标题
   */
  label?: string;
  /**
   * 输入框值
   */
  value?: string | number;
  /**
   * change事件
   */
  onChange?: (val: string) => void;
  /**
   * 默认值
   */
  defaultValue?: string | number;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 表现类型
   * @default 'normal'
   */
  variant?: 'normal' | 'warn' | 'danger';
  /**
   * 包裹元素的样式
   */
  outerStyle?: CSSProperties;
  /**
   * 其他 <input> 的原生属性
   */
  props?: InputHTMLAttributes<Target>;
}

const clsPrefix = `${theme['global-prefix']}-input`;

const Input: FC<InputProps> = ({
  label,
  value = '',
  onChange,
  defaultValue = '',
  disabled,
  variant = 'normal',
  outerStyle,
  ...props
}) => {
  const [val, setVal] = useState(defaultValue || value);
  const handleChange = (e: ChangeEvent<Target>) => {
    setVal(e.target.value);
    if (typeof onChange === 'function') onChange(e.target.value);
  };
  return (
    <span className={`${clsPrefix}-outer`} style={outerStyle}>
      <span
        className={classNames(`${clsPrefix}-wrapper`, `${clsPrefix}-wrapper-${variant}`, {
          [`${clsPrefix}-wrapper-filled`]: !!String(val),
          [`${clsPrefix}-wrapper-disabled`]: !!disabled,
        })}
      >
        <input
          {...props}
          value={val}
          onChange={handleChange}
          disabled={disabled}
          placeholder=""
          className={`${clsPrefix}-x`}
        />
        {!!label && <label className={`${clsPrefix}-label`}>{label}</label>}
        <span className={`${clsPrefix}-line`} />
      </span>
    </span>
  );
};

export default Input;
