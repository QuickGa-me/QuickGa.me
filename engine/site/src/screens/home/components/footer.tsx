import React from 'react';

export const Footer: React.SFC = () => {
  return (
    <div className={'footer holder'}>
      <div className={'inner'}>
        <span>Copyright © Salvatore Aiello, Dested LLC {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
