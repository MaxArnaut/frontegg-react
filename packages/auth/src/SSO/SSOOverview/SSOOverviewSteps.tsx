import React, { ComponentType } from 'react';
import { WithT, withT, RendererFunction } from '@frontegg/react-core';
import { AuthState } from '../../Api';
import { withAuth } from '../../HOCs';


const stateMapper = ({ ssoState }: AuthState) => ({ ssoState });

export interface SSOOverviewStepsProps {
  renderer?: RendererFunction<SSOOverviewStepsProps>;
}

type Props = ReturnType<typeof stateMapper> & WithT & SSOOverviewStepsProps

class SSOOverviewStepsComponent extends React.Component<Props> {

  render() {
    return 'SSOOverviewSteps';
  }
}

export const SSOOverviewSteps = withAuth(withT()(SSOOverviewStepsComponent), stateMapper) as ComponentType<SSOOverviewStepsProps>;
