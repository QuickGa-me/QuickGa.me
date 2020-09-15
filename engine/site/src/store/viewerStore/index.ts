import {action, observable} from 'mobx';

export class ViewerStore {
  @observable isMobile: boolean = false;
  @observable jwt?: string;
  @action setMobile() {
    this.isMobile = true;
  }
  @action setJwt(jwt: string) {
    this.jwt = jwt;
  }

  @action logout() {
    this.jwt = undefined;
  }
}

export const viewerStore = new ViewerStore();
export type ViewerStoreProps = {viewerStore: ViewerStore};
