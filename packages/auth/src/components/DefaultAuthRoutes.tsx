import React, { FC, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginPage, LogoutPage, LoginWithSSOPage } from '../Login';
import { ActivateAccountPage } from '../ActivateAccount';
import { ForgotPasswordPage } from '../ForgotPassword';
import { ResetPasswordPage } from '../ResetPassword';
import { AuthPageProps } from '../interfaces';
import { AuthState } from '../Api';
// import { withAuth } from '../HOCs';
import { useAuth } from '../hooks';

const stateMapper =
  ({ routes, isLoading, header, loaderComponent, ssoState }: AuthState) =>
    ({ routes, isLoading, defaultComps: { header, loaderComponent }, ssoState });
//
//
// class DefaultAuthRoutes extends React.Component<AuthPageProps & ReturnType<typeof stateMapper>> {
//   render() {
//     const {
//       routes: {
//         loginUrl,
//         logoutUrl,
//         forgetPasswordUrl,
//         resetPasswordUrl,
//         activateUrl,
//       },
//       isLoading,
//       header,
//       loaderComponent,
//       defaultComps,
//       ssoState,
//       children,
//       ...rest
//     } = this.props;
//
//
//     let samlCallbackPath = null;
//
//     if (!ssoState.loading && ssoState.samlConfiguration?.enabled && ssoState.samlConfiguration?.acsUrl) {
//       const url = new URL(ssoState.samlConfiguration?.acsUrl);
//       samlCallbackPath = url.pathname;
//     }
//     const pageProps = {
//       ...rest,
//       ...defaultComps,
//       ...(header !== undefined ? { header } : {}),
//       ...(loaderComponent !== undefined ? { loaderComponent } : {}),
//     };
//     return pageProps.loaderComponent && isLoading ? pageProps.loaderComponent :
//       <Switch>
//         <Route exact path={loginUrl} render={() => <LoginPage {...pageProps}/>}/>
//         <Route exact path={logoutUrl} render={() => <LogoutPage {...pageProps}/>}/>
//         <Route exact path={forgetPasswordUrl} render={() => <ForgotPasswordPage {...pageProps}/>}/>
//         <Route exact path={resetPasswordUrl} render={() => <ResetPasswordPage {...pageProps}/>}/>
//         <Route exact path={activateUrl} render={() => <ActivateAccountPage {...pageProps}/>}/>
//         {samlCallbackPath && <Route exact path={samlCallbackPath} render={() => <LoginWithSSOPage {...pageProps}/>}/>}
//         <Route path='*' children={() => children}/>
//       </Switch>;
//   }
// }
//
// export default withAuth(DefaultAuthRoutes, stateMapper);


export const AuthRoutes: FC<AuthPageProps> = (props) => {
  const { header, loaderComponent, children, ...rest } = props;
  const { routes, isLoading, defaultComps, ssoState: { loading: ssoLoading, samlConfiguration } } = useAuth(stateMapper);

  const samlCallbackPath = useMemo(() => {
    if (!ssoLoading && samlConfiguration?.enabled && samlConfiguration?.acsUrl) {
      return new URL(samlConfiguration?.acsUrl).pathname;
    }
    return null;
  }, [ssoLoading, samlConfiguration]);

  const pageProps = {
    ...rest,
    ...defaultComps,
    ...(header !== undefined ? { header } : {}),
    ...(loaderComponent !== undefined ? { loaderComponent } : {}),
  };

  if (pageProps.loaderComponent && isLoading) {
    return <>{pageProps.loaderComponent}</>;
  }

  return <Switch>
    <Route exact path={routes.loginUrl} render={() => <LoginPage {...pageProps}/>}/>
    <Route exact path={routes.logoutUrl} render={() => <LogoutPage {...pageProps}/>}/>
    <Route exact path={routes.forgetPasswordUrl} render={() => <ForgotPasswordPage {...pageProps}/>}/>
    <Route exact path={routes.resetPasswordUrl} render={() => <ResetPasswordPage {...pageProps}/>}/>
    <Route exact path={routes.activateUrl} render={() => <ActivateAccountPage {...pageProps}/>}/>
    {samlCallbackPath && <Route exact path={samlCallbackPath} render={() => <LoginWithSSOPage {...pageProps}/>}/>}
    <Route path='*' children={() => children}/>
  </Switch>;
};
