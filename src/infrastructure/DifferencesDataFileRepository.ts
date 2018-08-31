import {DifferencesRepository} from "../application/analyze/DifferencesRepository";
import {DefaultFileRepository} from "./DefaultFileRepository";
import {injectable, inject} from "inversify";

class DifferencesDataFileRepository extends DefaultFileRepository implements DifferencesRepository {

    constructor() {
        super('differences/');
    }

    listNames(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            super.list().then((files) => {
                let names = [];
                for (let file of files) {
                    names.push(file.replace('.txt', ''));
                }

                resolve(names);
            })
        });
    }
}

export {DifferencesDataFileRepository}