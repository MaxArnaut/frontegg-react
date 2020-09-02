import React, { ComponentType } from 'react';

export type FormFieldProps = {
  inFormik?: boolean; // default: false
  inForm?: boolean; // default: false
  size?: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive' // default: undefined
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, FormFieldProps {
  label?: string;
  labelButton?: ButtonProps;
  fullWidth?: boolean;
  error?: string;
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>, FormFieldProps {
  testId?: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';

  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
  type?: 'button' | 'submit' | 'reset';

  // formik props
  formikDisableIfNotDirty?: boolean // default true
}

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  inFormik?: boolean; // default is true
}

export interface LoaderProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  center?: boolean;
}


export type ElementProps = {
  Button: ComponentType<ButtonProps>,
  Input: ComponentType<InputProps>,
  Form: ComponentType<FormProps>,
  Loader: ComponentType<LoaderProps>,
};

export type ElementType =
  | 'Button'
  | 'Input'
  | 'Form'
  | 'Loader'

export type Elements = {
  [type in ElementType]: ElementProps[type]
}
