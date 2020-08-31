import React, { createRef } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { AuthActions, AuthState, LoginStep } from '../Api';
import { Button } from 'semantic-ui-react';
import { withAuth } from '../HOCs';
import {
  validateEmail,
  validateSchema,
  validatePassword,
  FieldInput,
  FieldButton, WithT, withT,
} from '@frontegg/react-core';


const mapper = {
  state: ({ loginState, isSSOAuth, onRedirectTo, routes }: AuthState) => ({ loginState, isSSOAuth, onRedirectTo, routes }),
  actions: ({ preLogin, login, setLoginState, resetLoginState, setForgotPasswordState }: AuthActions) => ({
    preLogin,
    login,
    setLoginState,
    resetLoginState,
    setForgotPasswordState,
  }),
};

type Props = ReturnType<typeof mapper.state> & ReturnType<typeof mapper.actions> & WithT

class LoginWithPasswordComponent extends React.Component<Props> {

  passwordField = createRef<HTMLInputElement>();
  lastLoginStep = LoginStep.preLogin;

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
    const { loginState, isSSOAuth } = this.props;
    if (this.lastLoginStep !== loginState.step && isSSOAuth && this.passwordField.current) {
      this.lastLoginStep = loginState.step;
      this.passwordField.current.focus();
    }
  }

  backToPreLogin = () => this.props.setLoginState({ step: LoginStep.preLogin });

  forgetPasswordButton = () => {
    const { t, loginState: { loading }, setForgotPasswordState, resetLoginState, onRedirectTo, routes } = this.props;
    return <Field>
      {({ form: { values } }: FieldProps) => (
        <Button disabled={loading} type='button' className='fe-field-button' onClick={() => {
          setForgotPasswordState({ email: values.email });
          resetLoginState();
          onRedirectTo(routes.forgetPasswordUrl);
        }}>{t('auth.login.forgot-password')}</Button>
      )}
    </Field>;
  };

  render() {
    const {
      t,
      loginState: { loading, step, error },
      isSSOAuth,
      preLogin,
      login,
      setLoginState,
      resetLoginState,
      setForgotPasswordState,
      onRedirectTo,
      routes: { forgetPasswordUrl },
    } = this.props;

    const shouldDisplayPassword = !isSSOAuth || step === LoginStep.loginWithPassword;
    const shouldBackToLoginIfEmailChanged = isSSOAuth && shouldDisplayPassword;
    const validationSchema: any = { email: validateEmail(t) };
    if (shouldDisplayPassword) {
      validationSchema.password = validatePassword(t);
    }

    return <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validateSchema(validationSchema)}
      onSubmit={shouldDisplayPassword ?
        ({ email, password }) => login({ email, password }) :
        ({ email }) => preLogin({ email })
      }>
      <Form>
        <FieldInput
          label={t('auth.login.email')}
          name='email'
          placeholder='name@example.com'
          focus={shouldBackToLoginIfEmailChanged ? false : undefined}
          onChange={shouldBackToLoginIfEmailChanged ? this.backToPreLogin : undefined}/>

        {shouldDisplayPassword && <FieldInput
          label={t('auth.login.password')}
          labelButton={this.forgetPasswordButton()}
          type='password'
          name='password'
          wrapperClassName={'fe-hidden-element'}
          forwardRef={this.passwordField}
          placeholder={t('auth.login.enter-your-password')}
          disabled={!shouldDisplayPassword}/>}

        <FieldButton fluid={true} primary={!loading} loading={loading}>
          {shouldDisplayPassword ? t('auth.login.login') : t('auth.login.continue')}
        </FieldButton>
        {error && <div className='fe-login-error-message'>{error}</div>}
      </Form>
    </Formik>;
  }
}

export const LoginWithPassword = withAuth(withT()(LoginWithPasswordComponent), mapper);
