import {Spinner} from '@blueprintjs/core/lib/esm/components/spinner/spinner';
import {BoxCard} from './boxCard';
import React from 'react';

export function Loading() {
  return (
    <BoxCard theme={'grey'} elevation={1} header={'BounceBlockParty!'}>
      <Spinner size={30} />
    </BoxCard>
  );
}
