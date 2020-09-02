import { PluginConfig } from '@frontegg/react-core';
import { preloadedState, reducer, sagas, storeName } from './Api';
import Listener from './Listener';
import { AuthPluginOptions } from './interfaces';
import './index.scss';

export * from './Api';
export * from './hooks';
export * from './HOCs';
export * from './components';
export * from './Login';
export * from './ActivateAccount';
export * from './ForgotPassword';
export * from './ResetPassword';
export * from './SSO';


export const AuthPlugin = (options: AuthPluginOptions): PluginConfig => ({
  storeName,
  preloadedState: {
    ...preloadedState,
    ...options,
  },
  reducer,
  sagas,
  Listener,
});
