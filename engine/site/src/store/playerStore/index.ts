import {action, computed, observable} from 'mobx';
import {HttpPlayerModel} from '../../dataServices/app.generated';
import {persist} from 'mobx-persist';

export class PlayerStore {
  @observable isMobile: boolean = false;
  @observable @persist jwt?: string;
  @observable player?: HttpPlayerModel;

  @action setMobile() {
    this.isMobile = true;
  }
  @action setJwt(jwt: string) {
    this.jwt = jwt;
  }
  @action setPlayer(player: HttpPlayerModel) {
    this.player = player;
  }
  @computed get isAnon() {
    return this.player?.anon;
  }
  @action logout() {
    this.jwt = undefined;
  }
}

export const playerStore = new PlayerStore();
export type PlayerStoreProps = {playerStore: PlayerStore};
