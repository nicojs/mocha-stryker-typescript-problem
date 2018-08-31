import {SiengeDataFetcherRestClient} from "../../infrastructure/SiengeDataFetcherRestClient";
import {BaselineResetterFactory} from "./BaselineResetterFactory";
import {BaselineRepository} from "./BaselineRepository";
import {CurrentRepository} from "../current/CurrentRepository";
import {inject, injectable} from "inversify";
import {SiengeEndpointsRepository} from "../SiengeEndpointsRepository";

@injectable()
class BaselineResetter {

    private endpointsRepository: SiengeEndpointsRepository;
    private siengeRestClient: SiengeDataFetcherRestClient;
    private baselineRepository: BaselineRepository;
    private currentRepository: CurrentRepository;

    constructor(@inject('baselineResetterFactory') factory: BaselineResetterFactory) {
        this.endpointsRepository = factory.endpointsRepository;
        this.siengeRestClient = factory.siengeRestClient;
        this.currentRepository = factory.currentRepository;
        this.baselineRepository = factory.baselineRepository;
    }

    reset() {
        this.endpointsRepository.retrieveEndpoints()
            .then((clientsLinks) =>
                this.siengeRestClient.fetchAllInconsistencies(clientsLinks, this.baselineRepository));
    }
}

export { BaselineResetter }