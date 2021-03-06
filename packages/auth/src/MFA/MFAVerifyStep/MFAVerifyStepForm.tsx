import React, { FC, useEffect } from 'react';
import { FInput, Loader, useT } from '@frontegg/react-core';
import { useAuth } from '../../hooks';

export const MFAVerifyStepForm: FC = (props) => {
  const { t } = useT();
  const { loading, qrCode, enrollMfa } = useAuth((state) => state.mfaState);
  useEffect(() => {
    enrollMfa();
  }, []);
  const children = props.children ?? (
    <>
      <ol className='fe-mfa__verify-form-ol'>
        <li>
          {t('auth.mfa.verify.scan-qr-description-1')}
          &nbsp;<span style={{ color: 'green' }}>Google Authenticator</span>&nbsp;
          {t('auth.mfa.verify.scan-qr-description-2')}
          <div className='fe-mfa__qr'>
            {loading && !qrCode ? <Loader inline={false} /> : <img alt='Multi-factor QR' src={qrCode ?? ''} />}
          </div>
        </li>
        <li>
          {t('auth.mfa.verify.enter-generated-code')}
          <FInput name='token' disabled={loading} placeholder='Ex. 1 2 3 4 5 6' />
        </li>
      </ol>
    </>
  );

  return <>{children}</>;
};
