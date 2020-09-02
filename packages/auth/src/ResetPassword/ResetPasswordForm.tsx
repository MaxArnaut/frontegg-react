import React, { ComponentType } from 'react';
import { AuthActions, AuthState } from '../Api';
import { Formik } from 'formik';
import {
  Form,
  Button,
  Input,
  omitProps,
  RendererFunction,
  validatePassword,
  validatePasswordConfirmation,
  validateSchema,
  WithT,
  ErrorMessage,
} from '@frontegg/react-core';
import { withAuth } from '../HOCs';

const stateMapper = ({ forgetPasswordState }: AuthState) => ({ forgetPasswordState });
const actionsMapper = ({ resetPassword }: AuthActions) => ({ resetPassword });

export interface ResetPasswordFormProps {
  renderer?: RendererFunction<Props, ResetPasswordFormProps>;
  userId: string;
  token: string;
}

type Props = ReturnType<typeof stateMapper> & ReturnType<typeof actionsMapper> & WithT & ResetPasswordFormProps

class ResetPasswordFormComponent extends React.Component<Props> {

  render() {
    const { t, renderer, forgetPasswordState: { loading, error }, resetPassword, userId, token } = this.props;

    if (renderer) {
      return renderer(omitProps(this.props, ['renderer', 'components']));
    }

    return <Formik
      validationSchema={validateSchema({
        password: validatePassword(t),
        confirmPassword: validatePasswordConfirmation(t),
      })}
      enableReinitialize={true}
      initialValues={{ password: '', confirmPassword: '' }}
      onSubmit={({ password }) => resetPassword({ userId, token, password })}>
      <Form>
        <Input
          inFormik
          type='password'
          name='password'
          label={t('auth.forgot-password.new-password')}
          placeholder={t('auth.forgot-password.enter-your-password')}/>
        <Input
          inFormik
          type='password'
          name='confirmPassword'
          label={t('auth.forgot-password.confirm-new-password')}
          placeholder={t('auth.forgot-password.enter-your-password-again')}/>
        <Button
          inFormik
          type='submit'
          fullWidth={true}
          loading={loading}
          variant='primary'>
          {t('auth.forgot-password.reset-password-button')}
        </Button>
        <ErrorMessage error={error}/>
      </Form>
    </Formik>;
  }
}

export const ResetPasswordForm = withAuth(
  ResetPasswordFormComponent,
  stateMapper,
  actionsMapper,
) as ComponentType<ResetPasswordFormProps>;
