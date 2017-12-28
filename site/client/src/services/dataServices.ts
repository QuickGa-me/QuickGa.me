import {GetAllGamesResponse, GetGameResponse} from "@common/models/http/gameController";
import {StorageService} from "./storageService";
import {SuccessResponse} from "@common/models/http/successResponse";

export class DataService {
    static apiUrl = 'http://localhost:3000';

    static async fetch<T>(options: { method: string; data?: any; params?: any; url: string }): Promise<T> {
        let body;
        if (options.method.toLocaleLowerCase() !== 'get') {
            options.data = options.data || {};
        }
        if (options.data !== undefined) {
            body = JSON.stringify(options.data);
        }
        if (options.params) {
            let str = [];
            for (let p in options.params) {
                if (options.params.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(options.params[p]));
                }
            }
            options.url += '?' + str.join('&');
            console.log(options.url);
        }
        const headerObject = new Headers();
        let headers = await this.getHeaders();
        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                headerObject.set(header, headers[header]);
            }
        }

        const request = new Request(options.url, {
            headers: headerObject,
            body: body || null,
            method: options.method
        });
        let response = await fetch(request);
        let status = response.status;
        if (status === 0) {
            console.log('status', status);
            console.log(options.url);
            throw 'Server could not be reached';
        } else if (status === 200) {
            return await response.json();
        } else if (status >= 500) {
            console.log('status', status);
            console.log(options.url);
            throw await response.json();
        } else {
            throw await response.json();
        }
    }

    static async getHeaders() {
        let headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
            // "__Date": moment().format('YYYY-MM-DD'),
            // "__Time": moment().format('HH:mm:ss'),
        };

        const value = StorageService.jwt;
        if (value) headers.Authorization = value;
        return headers;
    }
}

export class GameDataService extends DataService {
    static async getAllGames() {
        return await this.fetch<SuccessResponse<GetAllGamesResponse>>({
            method: 'GET',
            url: `${this.apiUrl}/games`
        });
    }

    static async getGameData(gameId: string) {
        return await this.fetch<SuccessResponse<GetGameResponse>>({
            method: 'GET',
            url: `${this.apiUrl}/games/${gameId}`
        });
    }
}