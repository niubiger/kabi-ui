import React, { SFC } from 'react';
import t from 'prop-types';
import styles from './index.scss';
// import './index.less';
import './index.scss';

export interface InputProps {
  label?: string,
}

const Input: SFC<InputProps> = ({ label, ...props }) => {
  return (
    <span className="input">
      {label}
      <input {...props} />
    </span>
  );
};

export default Input;
