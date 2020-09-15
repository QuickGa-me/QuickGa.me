import {viewerStore} from '../store/viewerStore';
import {AppConfig} from '../appConfig';
import {AppToaster} from '../appToaster';

export const ClientTransformOptions = (options: any): RequestInit => {
  options.headers = options.headers ?? {};
  if (viewerStore.jwt) {
    options.headers.authorization = `Bearer ${viewerStore.jwt}`;
  }
  options.headers['Content-Type'] = 'application/json';
  options.headers.Accept = 'application/json';
  return options;
};

export const ClientOptions: ControllerOptions = {
  baseUrl: AppConfig.host,
  getJwt: () => {
    return viewerStore.jwt!;
  },
  handleError: (error: string) => {
    if (error.toLowerCase().includes('fetch')) {
      error = 'Sorry, an error has occurred with BounceBlockParty.';
    }
    AppToaster.show({message: error, intent: 'danger'});
  },
  handleUnauthorized: (error: string) => {
    viewerStore.logout();
  },
};

export const ClientSocketOptions: ControllerOptions = {
  get baseUrl() {
    return AppConfig.socketHost + '?jwt=' + viewerStore.jwt;
  },
  getJwt: () => {
    return viewerStore.jwt!;
  },
  handleError: (error: string) => {
    AppToaster.show({message: error, intent: 'danger'});
  },
  handleUnauthorized: (error: string) => {
    viewerStore.logout();
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
  getJwt: () => string;
  handleError: (error: string) => void;
  handleUnauthorized: (error: string) => void;
}
