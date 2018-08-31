import {inject, injectable} from "inversify";
import {DataAnalyzer} from "../application/analyze/DataAnalyzer";

@injectable()
class AnalysisController {

    private dataAnalyzer: DataAnalyzer;

    constructor(@inject('dataAnalyzer') dataAnalyzer) {
        this.dataAnalyzer = dataAnalyzer;
    }

    get(request, response) {
        this.dataAnalyzer.listClientsWithAddedInconsistencies((clientsName) => {
            let links = [];
            for (let name of clientsName) {
                links.push('http://localhost:5398/analysis/' + name);
            }
            response.status(200).send(links);
        });
    }

    getByName(req, response, next) {
        let name = req.params.name;

        this.dataAnalyzer.getDiffFromClient(name, (diffChars) => {
            response.render('inconsistences.html', {diff:  JSON.stringify(diffChars)});
        })
    }
}

export {AnalysisController}