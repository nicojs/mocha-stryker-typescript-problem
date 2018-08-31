import {DefaultFileRepository} from "./DefaultFileRepository";
import {CurrentRepository} from "../application/current/CurrentRepository";
import {injectable} from "inversify";

@injectable()
class CurrentDataFileRepository extends DefaultFileRepository implements CurrentRepository {

    constructor() {
        super('current/')
    }
}

export { CurrentDataFileRepository }