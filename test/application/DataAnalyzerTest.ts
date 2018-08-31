import "reflect-metadata"
import * as assert from 'assert';

import * as rmdir from 'rimraf';
import * as fs from 'fs';
import {DifferencesDataFileRepository} from "../../src/infrastructure/DifferencesDataFileRepository";
import {DataAnalyzer} from "../../src/application/analyze/DataAnalyzer";
import {CurrentDataFileRepository} from "../../src/infrastructure/CurrentDataFileRepository";
import {BaselineDataFileRepository} from "../../src/infrastructure/BaselineDataFileRepository";

process.env.SERVER_FOLDER = __dirname + '/resources/';

describe('Given a set of files storing inconsistencies, this analyzer should', function () {

    beforeEach(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
        fs.mkdirSync(process.env.SERVER_FOLDER);
    });

    after(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
    });

    it('retrieve empty when there are no files with difference', function(done) {
        let baselineDataRepository = new BaselineDataFileRepository();
        let currentDataRepository =  new CurrentDataFileRepository();
        let differencesDataRepository = new DifferencesDataFileRepository();
        let dataAnalyzer = new DataAnalyzer(baselineDataRepository, currentDataRepository, differencesDataRepository);;

        console.log('im here again but' + Object.getOwnPropertyNames(dataAnalyzer));
        dataAnalyzer.listClientsWithAddedInconsistencies((clientFilesWithNewInconsistencies) => {
            assert.fail();
        });

        setTimeout(done, 200);
    });

    // it('retrieve differences between clients comparing with their baselines', function (done) {
    //     let baselineDataRepository = new BaselineDataFileRepository();
    //     let currentDataRepository =  new CurrentDataFileRepository();
    //     let differencesDataRepository = new DifferencesDataFileRepository();
    //     let dataAnalyzer = new DataAnalyzer(baselineDataRepository, currentDataRepository, differencesDataRepository);

    //     baselineDataRepository.store('ebm', 'No have inconsistencies');
    //     baselineDataRepository.store('pacaembu', 'No have inconsistencies');
    //     baselineDataRepository.store('secol', 'No have inconsistencies');

    //     currentDataRepository.store('ebm', '1 new inconsistency');
    //     currentDataRepository.store('pacaembu', 'No have inconsistencies');
    //     currentDataRepository.store('secol', '2 new inconsistencies');

    //     dataAnalyzer.listClientsWithAddedInconsistencies((clientFilesWithNewInconsistencies) => {
    //         assert.strictEqual(clientFilesWithNewInconsistencies[0], 'ebm');
    //         assert.strictEqual(clientFilesWithNewInconsistencies[1],'secol');
    //         assert.strictEqual(clientFilesWithNewInconsistencies.length,2);
    //         done();
    //     });
    // });

    // it('should retrieve as difference when client does not have their own counterpart on baseline', function(done) {
    //     let baselineDataRepository = new BaselineDataFileRepository();
    //     let currentDataRepository =  new CurrentDataFileRepository();
    //     let differencesDataRepository = new DifferencesDataFileRepository();
    //     let dataAnalyzer = new DataAnalyzer(baselineDataRepository, currentDataRepository, differencesDataRepository);;

    //     baselineDataRepository.store('ebm', 'Dont have current data monitored');
    //     currentDataRepository.store('pacaembu', 'Dont have baseline data saved');

    //     dataAnalyzer.listClientsWithAddedInconsistencies((clientFilesWithNewInconsistencies) => {
    //         assert.strictEqual(clientFilesWithNewInconsistencies[0],'pacaembu');
    //         assert.strictEqual(clientFilesWithNewInconsistencies.length,1);
    //         done();
    //     });
    // })
});