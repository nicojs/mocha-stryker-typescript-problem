import "reflect-metadata"
import {Kernel} from "inversify";

import {CurrentDataFileRepository} from "./infrastructure/CurrentDataFileRepository";
import {BaselineDataFileRepository} from "./infrastructure/BaselineDataFileRepository";
import {SiengeDataFetcherRestClient} from "./infrastructure/SiengeDataFetcherRestClient";
import {SiengeClientEndpointsLoader} from "./infrastructure/SiengeClientEndpointsLoader";
import {CurrentDataScanner} from "./application/current/CurrentDataScanner";

import {CurrentRepository} from "./application/current/CurrentRepository";
import {BaselineRepository} from "./application/baseline/BaselineRepository";
import {ScanController} from "./controller/ScanController";
import {BaselineResetter} from "./application/baseline/BaselineResetter";
import {BaselineResetterFactory} from "./application/baseline/BaselineResetterFactory";
import {SiengeEndpointsRepository} from "./application/SiengeEndpointsRepository";
import {AnalysisController} from "./controller/AnalysisController";
import {DataAnalyzer} from "./application/analyze/DataAnalyzer";
import {DifferencesRepository} from "./application/analyze/DifferencesRepository";
import {DifferencesDataFileRepository} from "./infrastructure/DifferencesDataFileRepository";

var kernel = new Kernel();

kernel.bind<ScanController>("scanController").to(ScanController);
kernel.bind<AnalysisController>("analysisController").to(AnalysisController);

kernel.bind<CurrentRepository>("currentRepository").to(CurrentDataFileRepository);
kernel.bind<BaselineRepository>("baselineRepository").to(BaselineDataFileRepository);
kernel.bind<DifferencesRepository>("differencesRepository").to(DifferencesDataFileRepository);
kernel.bind<CurrentDataScanner>("currentDataScanner").to(CurrentDataScanner);
kernel.bind<DataAnalyzer>("dataAnalyzer").to(DataAnalyzer);

kernel.bind<SiengeClientEndpointsLoader>("siengeEndpointsRepository").to(SiengeClientEndpointsLoader);
const INTERVAL_BETWEEN_REQUESTS = 4000;
kernel.bind<SiengeDataFetcherRestClient>("siengeInconsistenciesLoader")
    .toConstantValue(new SiengeDataFetcherRestClient(require('request'), INTERVAL_BETWEEN_REQUESTS));

kernel.bind<BaselineResetterFactory>("baselineResetterFactory").toDynamicValue(() => {
    let baselineResetterFactory = new BaselineResetterFactory();
    baselineResetterFactory.baselineRepository = kernel.get<BaselineRepository>('baselineRepository');
    baselineResetterFactory.currentRepository = kernel.get<CurrentRepository>('currentRepository');
    baselineResetterFactory.endpointsRepository = kernel.get<SiengeEndpointsRepository>('siengeEndpointsRepository');
    baselineResetterFactory.siengeRestClient = kernel.get<SiengeDataFetcherRestClient>('siengeInconsistenciesLoader');
    return baselineResetterFactory;
});

kernel.bind<BaselineResetter>("baselineResetter").to(BaselineResetter);

export {kernel}