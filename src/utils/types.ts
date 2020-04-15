import { Reducer } from 'react';

export type Action = {
  type: string;
  payload: any;
  [propName: string]: any;
};

export type Reducers = {
  [propName: string]: Reducer<any, Action>;
};
