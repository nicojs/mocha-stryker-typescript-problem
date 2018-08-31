import {inject, injectable} from "inversify";

const DEFAULT_INTERVAL = 4000;
import "console";

@injectable()
class SiengeDataFetcherRestClient {

    private _intervalBetweenRequests: number;
    private _httpRequestCaller: any;

    constructor(@inject('request') httpRequestCaller, intervalBetweenRequests?) {
        this._intervalBetweenRequests = intervalBetweenRequests ? intervalBetweenRequests : DEFAULT_INTERVAL;
        this._httpRequestCaller = httpRequestCaller;
    }

    fetchAllInconsistencies(clientsLinks, storeKeeper) {
        console.log('SiengeDataFetcherRestClient - starting calls');

        let interval = 0;
        for (let clientLink of clientsLinks) {
            setTimeout(() => {
                this._fetchInconsistenciesForClient(clientLink, (clientName, data) => {
                    storeKeeper.store(clientName, data);
                });
            }, interval);
            interval = interval + this._intervalBetweenRequests;
        }
    }

    _fetchInconsistenciesForClient(clientLink, successCallback) {
        let requestSettings = {
            url : clientLink.url,
            headers : this._headerTextPlainWithBasicAuth(clientLink)
        };
        this._httpRequestCaller(requestSettings, function(err, response, body) {
            if(err || response.statusCode !== 200) {
                console.log('SiengeDataFetcherRestClient - request failed to ' + clientLink.name());
                console.error(err);
                return;
            }
            console.log('SiengeDataFetcherRestClient - request succeeded to ' + clientLink.name());
            successCallback(clientLink.name(), body);
        });
    }

    _headerTextPlainWithBasicAuth(clientLink) {
        return {
            "Accept" : "text/plain",
            "Authorization": "Basic " + new Buffer("beaver:" + clientLink.password()).toString("base64")
        };
    }
}

export { SiengeDataFetcherRestClient }