import {playerStore} from '../store/playerStore';
import {AppConfig} from '../appConfig';
import {AppToaster} from '../appToaster';

export const ClientTransformOptions = (options: any): RequestInit => {
  options.headers = options.headers ?? {};
  if (playerStore.jwt) {
    options.headers.authorization = `Bearer ${playerStore.jwt}`;
  }
  options.headers['Content-Type'] = 'application/json';
  options.headers.Accept = 'application/json';
  return options;
};

export const ClientOptions: ControllerOptions = {
  baseUrl: AppConfig.host,
  getJwt: () => {
    return playerStore.jwt;
  },
  handleError: (error: string) => {
    if (error.toLowerCase().includes('fetch')) {
      error = 'Sorry, an error has occurred with BounceBlockParty.';
    }
    AppToaster.show({message: error, intent: 'danger'});
  },
  handleUnauthorized: (error: string) => {
    playerStore.logout();
  },
};

export const ClientSocketOptions: ControllerOptions = {
  get baseUrl() {
    return AppConfig.lobbyHost + '?jwt=' + playerStore.jwt;
  },
  getJwt: () => {
    return playerStore.jwt;
  },
  handleError: (error: string) => {
    AppToaster.show({message: error, intent: 'danger'});
  },
  handleUnauthorized: (error: string) => {
    playerStore.logout();
  },
};

export const handle400 = {
  400: (result: {error: string}) => {
    AppToaster.show({message: result.error, intent: 'danger'});
  },
};
export const handle401 = {
  401: (result: string) => {
    window.location.href = 'https://quickga.me/';
  },
};

export interface ControllerOptions {
  baseUrl: string;
  getJwt: () => string|undefined;
  handleError: (error: string) => void;
  handleUnauthorized: (error: string) => void;
}
