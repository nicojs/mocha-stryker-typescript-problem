import {BaselineRepository} from "../baseline/BaselineRepository";
import {CurrentRepository} from "../current/CurrentRepository";
import {DifferencesRepository} from "./DifferencesRepository";
import {inject, injectable} from "inversify";
import {diff} from "diff";

@injectable()
class DataAnalyzer {

    private baselineRepository: BaselineRepository;
    private currentRepository: CurrentRepository;
    private differencesRepository: DifferencesRepository;

    constructor(@inject('baselineRepository') baselineRepository: BaselineRepository,
                @inject('currentRepository') currentRepository: CurrentRepository,
                @inject('differencesRepository') differencesRepository: DifferencesRepository) {
        this.baselineRepository = baselineRepository;
        this.currentRepository = currentRepository;
        this.differencesRepository = differencesRepository;
    }

    getDiffFromClient(clientName, callback) {
        this.differencesRepository.read(clientName).then((current) => {
            this.baselineRepository.read(clientName).then((baseline) => {
                let diffChars = diff.diffChars(baseline, current, {ignoreWhitespace: true});
                callback(diffChars);
            })
        })
    }

    listClientsWithAddedInconsistencies(callback) {
        this.analyzeDifferences(() => {
            setTimeout(() => {
                this.differencesRepository.listNames().then(callback)
            }, 500);
        });
    }

    public analyzeDifferences(callback) {
        console.log('DataAnalyzer::Analyzing differences');
        this.currentRepository.list().then((files) => {
            for (let index = 0; index < files.length; index++) {
                this.processDifferenceFor(files[index]);
                this.callbackAfterFinishes(index, files.length, callback);
            }
        })
    }

    private callbackAfterFinishes(currentIndex, totalOfFiles, callback) {
        if(!callback) {
            return;
        }

        if (currentIndex + 1 >= totalOfFiles) {
            console.log('DataAnalyzer::Finishing Analysis');
            setTimeout(callback, 1000);
        }
    }

    private processDifferenceFor(file) {
        this.baselineRepository.read(file).then((baselineData) =>
            this.currentRepository.read(file).then((currentData) => {
                this.checkAndStoreDifference(baselineData, currentData, file);
            }));
    }

    private checkAndStoreDifference(baselineData, currentData, file) {
        if (this.haveDifferences(baselineData, currentData)) {
            return this.storeDifference(file, currentData)
        }
    }

    private haveDifferences(baselineData, currentData) {
        return !Buffer.from(baselineData).equals(Buffer.from(currentData));
    }

    private storeDifference(file, currentData) {
        console.log('Storing difference for ' + file);
        return this.differencesRepository.store(file, currentData)
    }
}

export { DataAnalyzer }