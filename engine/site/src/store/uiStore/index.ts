import {action, observable} from 'mobx';

export type MessageType = {message: string; type: 'danger' | 'success'};

export class UIStore {
  @observable message?: MessageType;

  @action setMessage(message: MessageType | undefined): void {
    this.message = message;
  }
}

export const uiStore = new UIStore();
export type UIStoreProps = {uiStore: UIStore};
