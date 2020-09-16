import {uiStore} from './store/uiStore';

export const AppToaster = {
  show: (params: {intent: 'danger' | 'success'; message: string}) => {
    uiStore.setMessage({message: params.message, type: params.intent});
  },
};
