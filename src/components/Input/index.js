import React from 'react';
import styles from './index.less';

export default function Input(props) {
  return (
    <span classNames={styles.input}>
      <input {...props} />
    </span>
  );
}
