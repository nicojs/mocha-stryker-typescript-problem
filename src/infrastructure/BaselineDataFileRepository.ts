import {BaselineRepository} from "../application/baseline/BaselineRepository";
import {DefaultFileRepository} from "./DefaultFileRepository";

class BaselineDataFileRepository extends DefaultFileRepository implements BaselineRepository {

    constructor() {
        super('baseline/');
    }
}

export { BaselineDataFileRepository }