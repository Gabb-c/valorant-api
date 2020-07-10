import axios, { AxiosInstance } from 'axios';

import { Region } from '../types/region';
import { ContentDTo } from '../types/valorant/VAL-CONTENT-V1';
import { MatchDto, MatchlistDto } from '../types/valorant/VAL-MATCH-V1';

class API {
    private request: AxiosInstance;

    private token: string = '';
    private region: Region | null = null;

    constructor() {
        this.request = axios.create();

        this.request.interceptors.request.use((request) => {
            if (this.region === null) {
                throw new Error('No region is classified');
            }
            if (this.token.length === 0) {
                throw new Error('No token is classified');
            }

            request.baseURL = `https://${this.region.endpoint}.api.riotgames.com/`;
            request.headers['X-Riot-Token'] = this.token;

            return request;
        });

        this.request.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                if (error.response?.data?.status) {
                    console.error(
                        `Server rejected request: ${error.response.data.status.status_code} ${error.response.data.status.message}`,
                    );
                }

                throw error;
            },
        );
    }

    public setRegion(region: Region) {
        this.region = region;
        return this;
    }

    public setToken(token: string) {
        this.token = token;
        return this;
    }

    /**
     * Fetch all the content that VALORANT offers
     *
     * API Endpoint: `/val/content/v1/contents`
     *
     * @description Get content optionally filtered by locale
     *
     * @remark
     * **`Requires API Key`**
     *
     * @returns A promise containing the ContentV1 API Response: `{@link ContentDTo}`
     *
     * {@link https://developer.riotgames.com/apis#val-content-v1/GET_getContent Reference of VAL-CONTENT-V1}
     */
    public getContent(): Promise<ContentDTo> {
        return this.request.get('/val/content/v1/contents');
    }

    /**
     * Fetch match by the match id
     *
     * API Endpoint: `GET /val/match/v1/matches/{matchId}`
     *
     * @description Get match by id
     *
     * @remark
     * **`Requires API Key`**
     *
     * @returns A promise containing the VAL-MATCH-V1 API Response: `{@link MatchDto}`
     *
     * {@link https://developer.riotgames.com/apis#val-match-v1/GET_getMatch Reference of VAL-MATCH-V1}
     */
    public getMatchById(matchId: string): Promise<MatchDto> {
        return this.request.get(`/val/match/v1/matches/${matchId}`);
    }

    /**
     * Fetch match by the match id
     *
     * API Endpoint: `GET /val/match/v1/matchlists/by-puuid/{puuid}`
     *
     * @description Get matchlist for games played by puuid
     *
     * @remark
     * **`Requires API Key`**
     *
     * @returns A promise containing the VAL-MATCH-V1 API Response: `{@link MatchlistDto}`
     *
     * {@link https://developer.riotgames.com/apis#val-match-v1/GET_getMatch Reference of VAL-MATCH-V1}
     */
    public getMatchesByPuuid(puuid: string): Promise<MatchlistDto> {
        return this.request.get(`/val/match/v1/matchlists/by-puuid/${puuid}`);
    }
}

export = new API();