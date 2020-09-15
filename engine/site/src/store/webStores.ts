import React from 'react';
import {uiStore, UIStoreProps} from './uiStore';
import {playerStore, PlayerStoreProps} from './playerStore';

export type WebStoreProps = PlayerStoreProps & UIStoreProps;

export const webStores: WebStoreProps = {
  uiStore,
  playerStore,
};

export const WebStoresContext = React.createContext<WebStoreProps>({
  uiStore,
  playerStore,
});

export function useWebStores(): WebStoreProps {
  return React.useContext(WebStoresContext);
}
