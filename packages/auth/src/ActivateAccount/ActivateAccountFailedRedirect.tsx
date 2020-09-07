import React, { FC } from 'react';
import { useT, RendererFunctionFC, Button, omitProps } from '@frontegg/react-core';
import { AuthActions, AuthState } from '../Api';
import { useAuth } from '../hooks';

const stateMapper = ({ routes, onRedirectTo }: AuthState) => ({ routes, onRedirectTo });
const actionsMapper = ({ resetActivateState }: AuthActions) => ({ resetActivateState });

export interface ActivateAccountFailedRedirectProps {
  renderer?: RendererFunctionFC<ActivateAccountFailedRedirectProps>;
}

export const ActivateAccountFailedRedirect: FC<ActivateAccountFailedRedirectProps> = (props) => {
  const { renderer } = props;
  const { t } = useT();
  const { routes, onRedirectTo, resetActivateState } = useAuth(stateMapper, actionsMapper);

  if (renderer) {
    return renderer(omitProps(props, ['renderer']));
  }
  return (
    <>
      <div className='fe-center fe-error-message'>
        {t('auth.activate-account.failed-title')}
        <br />
        {t('auth.activate-account.failed-description')}
      </div>
      <Button
        fullWidth
        onClick={() => {
          resetActivateState();
          onRedirectTo(routes.loginUrl);
        }}
      >
        {t('auth.activate-account.back-to-login')}
      </Button>
    </>
  );
};
