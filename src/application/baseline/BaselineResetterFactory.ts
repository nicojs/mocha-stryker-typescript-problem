import {BaselineRepository} from './BaselineRepository';
import {CurrentRepository} from "../current/CurrentRepository";
import {SiengeClientEndpointsLoader} from "../../infrastructure/SiengeClientEndpointsLoader";
import {SiengeDataFetcherRestClient} from "../../infrastructure/SiengeDataFetcherRestClient";
import {inject, injectable} from "inversify";
import {SiengeEndpointsRepository} from "../SiengeEndpointsRepository";

@injectable()
class BaselineResetterFactory {

    private _baselineRepository: BaselineRepository;
    private _currentRepository: CurrentRepository;
    private _endpointsRepository: SiengeEndpointsRepository;
    private _siengeRestClient: SiengeDataFetcherRestClient;

    get endpointsRepository(): SiengeEndpointsRepository {
        return this._endpointsRepository;
    }

    set endpointsRepository(value: SiengeEndpointsRepository) {
        this._endpointsRepository = value;
    }

    get siengeRestClient(): SiengeDataFetcherRestClient {
        return this._siengeRestClient;
    }

    set siengeRestClient(value: SiengeDataFetcherRestClient) {
        this._siengeRestClient = value;
    }

    get baselineRepository(): BaselineRepository {
        return this._baselineRepository;
    }

    set baselineRepository(value: BaselineRepository) {
        this._baselineRepository = value;
    }

    get currentRepository(): CurrentRepository {
        return this._currentRepository;
    }

    set currentRepository(value: CurrentRepository) {
        this._currentRepository = value;
    }
}

export { BaselineResetterFactory }