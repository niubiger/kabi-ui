import React, {
  ChangeEvent,
  useState,
  CSSProperties,
  InputHTMLAttributes,
  ChangeEventHandler,
  Ref,
  ForwardRefExoticComponent,
  useRef,
  useImperativeHandle,
} from 'react';
import classNames from 'classnames';
import theme from '../../config/theme';
import './index.scss';

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
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
   * 额外样式类名
   */
  className?: string;
  /**
   * 其他 <input> 的原生属性
   */
  props?: InputHTMLAttributes<HTMLInputElement>;
}

const clsPrefix = `${theme['global-prefix']}-input`;

const Input: ForwardRefExoticComponent<InputProps> = React.forwardRef(
  (
    {
      label,
      value = '',
      onChange,
      defaultValue = '',
      disabled,
      variant = 'normal',
      outerStyle,
      className,
      ...props
    },
    ref: Ref<Partial<HTMLInputElement>>,
  ) => {
    const [val, setVal] = useState(defaultValue || value);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
      if (typeof onChange === 'function') onChange(e);
    };
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus: opt => {
        (inputRef.current as HTMLInputElement).focus(opt);
      },
      blur: () => {
        (inputRef.current as HTMLInputElement).blur();
      },
    }));
    return (
      <span className={classNames(`${clsPrefix}-outer`, className)} style={outerStyle}>
        <span
          className={classNames(`${clsPrefix}-wrapper`, `${clsPrefix}-wrapper-${variant}`, {
            [`${clsPrefix}-wrapper-filled`]: !!String(val),
            [`${clsPrefix}-wrapper-disabled`]: !!disabled,
          })}
        >
          <input
            {...props}
            ref={inputRef}
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
  },
);

export default Input;
