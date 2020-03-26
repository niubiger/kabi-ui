import React, { SFC } from 'react';
import './index.scss';
import config from '../../config/theme.js';
export interface ButtonProps {
  type?: string,
}
const Button: SFC<ButtonProps> = ({ type="default",children, ...props }) => {
  const classPrefix=`${config['global-prefix']}-button`;

  return (
  <button className={`${classPrefix} ${classPrefix}-${type}`}>{children}</button>
  );
};

export default Button;