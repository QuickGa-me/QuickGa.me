import {action, observable} from 'mobx';

export class PlayerStore {
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

export const playerStore = new PlayerStore();
export type PlayerStoreProps = {playerStore: PlayerStore};
