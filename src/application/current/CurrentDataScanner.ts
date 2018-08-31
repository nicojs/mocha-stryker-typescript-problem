import {SiengeDataFetcherRestClient} from "../../infrastructure/SiengeDataFetcherRestClient";
import {CurrentRepository} from "./CurrentRepository";
import {SiengeEndpointsRepository} from "../SiengeEndpointsRepository";
import {inject, injectable} from "inversify";

@injectable()
class CurrentDataScanner {

    private endpointsRepository: SiengeEndpointsRepository;
    private siengeRestClient: SiengeDataFetcherRestClient;
    private currentRepository: CurrentRepository;

    constructor(@inject('siengeEndpointsRepository') endpointsRepository: SiengeEndpointsRepository,
                @inject('siengeInconsistenciesLoader') siengeRestClient: SiengeDataFetcherRestClient,
                @inject('currentRepository') currentRepository: CurrentRepository) {
        this.endpointsRepository = endpointsRepository;
        this.siengeRestClient = siengeRestClient;
        this.currentRepository = currentRepository;
    }

    public scan() {
        this.endpointsRepository.retrieveEndpoints()
            .then((clientsLinks) =>
                this.siengeRestClient.fetchAllInconsistencies(clientsLinks, this.currentRepository))
    }
}

export {CurrentDataScanner}