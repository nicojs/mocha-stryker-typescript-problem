import {injectable} from "inversify";
import {SiengeEndpointsRepository} from "../application/SiengeEndpointsRepository";
import {ClientLink} from "../domain/ClientLink";
var request = require('request');

@injectable()
class SiengeClientEndpointsLoader implements SiengeEndpointsRepository {

    handleEndpointsResponse(response, body) {
        let clients = [];
        if (response.statusCode !== 200) {
            throw 'Fetch webhooks error status code ' + response.statusCode;
        }

        let json = JSON.parse(body)._embedded;
        for (let client of json.webhooks) {
            let invalidDataMonitorUrl = this.transformWebhookUrlToInvalidDataMonitorUrl(client["url"]);
            let clientId = this.extractClientID(client);
            clients.push(new ClientLink(invalidDataMonitorUrl, clientId));
            console.log(invalidDataMonitorUrl + ' - ' + clientId + ' has selected to be monitored');
        }
        return clients;
    }

    private extractClientID(client) {
        return client["_links"]["self"]["href"].split("/webhooks/")[1].split("_")[0];
    }

    private transformWebhookUrlToInvalidDataMonitorUrl(webhookUrl) {
        return webhookUrl.split('/api/v1/feature-toggles')[0] + '/resteasy/invalid-data-monitor';
    }

    retrieveEndpoints(): Promise<ClientLink[]> {
        return undefined;
    }
}

export { SiengeClientEndpointsLoader }
