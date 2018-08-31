import {CurrentDataScanner} from "../application/current/CurrentDataScanner";
import {BaselineResetter} from "../application/baseline/BaselineResetter";
import {inject, injectable} from "inversify";

@injectable()
class ScanController {

    private currentDataScanner : CurrentDataScanner;
    private baselineResetter: BaselineResetter;

    constructor(@inject("currentDataScanner") currentDataScanner : CurrentDataScanner,
                @inject("baselineResetter") baselineResetter : BaselineResetter) {
        this.currentDataScanner = currentDataScanner;
        this.baselineResetter = baselineResetter;
    }

    scan(request, response) {
        this.currentDataScanner.scan();

        return response.status(200).send();
    }

    resetBaseline(request, response) {
        this.baselineResetter.reset();

        return response.status(200).send();
    }

    initialize(request, response) {
        return response.status(500).send();
    }
}

export { ScanController }