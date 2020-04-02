import React, { FC, ReactNode, ReactElement } from 'react';
import ReactDom from 'react-dom';
import theme from '../../config/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faExclamationCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { css, keyframes } from '@emotion/core';
import './index.scss';
type IconType = 'info' | 'success' | 'error' | 'warn' | 'loading';
const iconType = {
  info: faInfoCircle,
  success: faCheckCircle,
  error: faTimesCircle,
  warn: faExclamationCircle,
  loading: faSpinner,
};
export interface Config {
  showTime?: number;
  hideTime?: number;
  top?: number;
  maxCount?: number;
}
export interface DefaultConfig {
  showTime: number;
  hideTime: number;
  top: number;
  maxCount: number;
}
export interface MessageProps {
  /**
   * 任意字符串或者ReactNode
   */
  content: ReactNode;
  /**
   * 持续时间（不包含显示和隐藏时间）
   * @default 2
   */
  duration: number;
  /**
   * 结束回调
   */
  onClose?: () => void;
  /**
   * 配置项
   * {showTime?: number;出现时间
   * hideTime?: number;隐藏时间
   * top?: number;距离顶部距离(px)
   * maxCount?: number;同时最多显示几个(默认不限制)}
   */
  config?: Config;
}
const delay: (time: number) => Promise<any> = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
const clsPrefix = `${theme['global-prefix']}-message`;
type RP = { root: HTMLDivElement; promise?: Promise<any>; key: string; index: number };
export interface MessageType {
  defaultConfig: DefaultConfig;
  rootAndPromiseArr: RP[];
  config: (option: Config) => DefaultConfig;
  mountRoot: () => RP;
  mergeConfig: (config?: Config) => DefaultConfig;
  renderEle: (
    reactEle: ReactElement,
    rp: RP,
    duration: number,
    config: DefaultConfig,
    onClose?: () => void,
  ) => Promise<any>;
  getMessageEle: (
    type: IconType,
    config: DefaultConfig,
    rp: RP,
    duration: number,
    content: ReactNode,
  ) => ReactElement;
  commonDeal: (
    type: IconType,
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
  info: (
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
  success: (
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
  error: (
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
  warn: (
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
  loading: (
    content: ReactNode,
    duration: number,
    onClose?: () => void,
    config?: Config,
  ) => Promise<any>;
}
const message: MessageType = {
  defaultConfig: { showTime: 0.3, hideTime: 0.3, top: 60, maxCount: Infinity },
  rootAndPromiseArr: [],
  config(option: Config) {
    return Object.assign(message.defaultConfig, option);
  },
  mountRoot() {
    let root = document.createElement('div');
    let key = performance.now().toString();
    let index = message.rootAndPromiseArr.length;
    let rp = { root, key, index };
    message.rootAndPromiseArr.push(rp);
    document.body.appendChild(root);
    return rp;
  },
  getMessageEle(type, config, rp, duration, content) {
    let icon: IconDefinition = iconType[type];
    const showAnimation = keyframes`
        0%{
          top:-40px;
          opacity: 0;
        }
        100%{
          top:${config.top + rp.index * 50}px;
          opacity: 1;
        }
    `;
    return (
      <div
        className={`${clsPrefix}-outer ${clsPrefix}-${type}`}
        css={css`
          animation: ${showAnimation} ${config.showTime}s ease-out forwards,
            ${showAnimation} ${config.hideTime}s ${duration}s ease-in reverse forwards;
        `}
      >
        <FontAwesomeIcon icon={icon} className={type === 'loading' ? 'fa-spin fa-pulse' : ''} />
        {content}
      </div>
    );
  },
  renderEle(reactEle, rp, duration, config, onClose) {
    return new Promise(resolve => {
      ReactDom.render(reactEle, rp.root, async function() {
        await delay((duration + config.showTime + config.hideTime) * 1000);
        onClose && onClose();
        resolve();
        let idx = message.rootAndPromiseArr.findIndex(item => item.key === rp.key);
        document.body.removeChild(rp.root);
        message.rootAndPromiseArr.splice(idx, 1);
      });
    });
  },
  mergeConfig(config) {
    return config ? { ...message.defaultConfig, ...config } : message.defaultConfig;
  },
  commonDeal(type, content, duration, onClose, config) {
    const innerConfig = message.mergeConfig(config);
    if (message.rootAndPromiseArr.length === innerConfig.maxCount) {
      return Promise.reject('overcount');
    }
    let rp = message.mountRoot();
    let reactEle = message.getMessageEle(type, innerConfig, rp, duration, content);
    let newPro = message.renderEle(reactEle, rp, duration, innerConfig, onClose);
    rp.promise = newPro;
    return newPro;
  },
  info(content, duration = 2, onClose, config) {
    return message.commonDeal('info', content, duration, onClose, config);
  },
  success(content, duration = 2, onClose, config) {
    return message.commonDeal('success', content, duration, onClose, config);
  },
  error(content, duration = 2, onClose, config) {
    return message.commonDeal('error', content, duration, onClose, config);
  },
  warn(content, duration = 2, onClose, config) {
    return message.commonDeal('warn', content, duration, onClose, config);
  },
  loading(content, duration = 2, onClose, config) {
    return message.commonDeal('loading', content, duration, onClose, config);
  },
};

export const Message: FC<MessageProps> = () => {
  return null;
};
export default message;
