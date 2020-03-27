import React, { SFC, ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import theme from '../../config/theme.js';
import './index.scss';

interface Target {
  value: string
}
export interface InputProps {
  /**
   * 输入框标题
   */
  label?: string,
  /**
   * 输入框值
   */
  value?: string | number,
  /**
   * change事件
   */
  onChange?: (val: string) => Boolean,
  /**
   * 默认值
   */
  defaultValue?: string | number,
  /**
   * 是否禁用
   */
  disabled?: boolean,
}

const clsPrefix = `${theme['global-prefix']}-input`;

const Input: SFC<InputProps> = ({ label, value = '', onChange, defaultValue = '', disabled, ...props }) => {
  const [val, setVal] = useState(defaultValue || value);
  const handleChange = (e: ChangeEvent<Target>) => {
    setVal(e.target.value);
    if (typeof onChange === 'function') onChange(e.target.value);
  };
  return (
    <span className={`${clsPrefix}-outer`}>
      <span
        className={classNames(`${clsPrefix}-wrapper`, {
          [`${clsPrefix}-wrapper-filled`]: !!String(value) || !!String(defaultValue),
          [`${clsPrefix}-wrapper-disabled`]: !!disabled,
        })}
      >
        <input {...props} value={val} onChange={handleChange} disabled={disabled} placeholder="" className={`${clsPrefix}-x`} />
        {!!label && <label className={`${clsPrefix}-label`}>{label}</label>}
        <span className={`${clsPrefix}-line`} />
      </span>
    </span>
  );
};

export default Input;
