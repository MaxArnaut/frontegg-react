import React from 'react';
import { IconProps, IconNames } from '@frontegg/react-core';
import classNames from 'classnames';
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
  DeleteRounded,
  FileCopyRounded,
  ImageRounded,
  WarningRounded,
} from '@material-ui/icons';
import './style.scss';

const iconMap: { [K in IconNames]: any } = {
  'left-arrow': ArrowBackRounded,
  'right-arrow': ArrowForwardRounded,
  checkmark: CheckRounded,
  copy: FileCopyRounded,
  warning: WarningRounded,
  image: ImageRounded,
  delete: DeleteRounded,
};

export class Icon extends React.Component<IconProps> {
  render() {
    const IconComponent = iconMap[this.props.name];
    if (IconComponent) {
      return <IconComponent {...this.props} className={classNames('fe-icon', this.props.className)} />;
    }
  }
}
