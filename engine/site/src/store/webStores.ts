import React from 'react';
import {uiStore, UIStoreProps} from './uiStore';

export type WebStoreProps = UIStoreProps;

export const webStores: WebStoreProps = {
  uiStore,
};

export const WebStoresContext = React.createContext<WebStoreProps>({
  uiStore,
});

export function useWebStores(): WebStoreProps {
  return React.useContext(WebStoresContext);
}
