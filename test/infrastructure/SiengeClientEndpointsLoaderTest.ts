import "reflect-metadata"
import * as assert from 'assert';
import {SiengeClientEndpointsLoader} from "../../src/infrastructure/SiengeClientEndpointsLoader";

process.env.SERVER_FOLDER = __dirname + '/resources/';

describe('Given a handler which deal with a webhooks list response', function () {

    it('when receives a response and body should convert to a list of clients links', function () {
        let siengeClientEndpointsLoader = new SiengeClientEndpointsLoader();

        let response = {
            statusCode : 200
        };

        let body = JSON.stringify(jsonBodyWebhooksExample);

        let clientsLinks = siengeClientEndpointsLoader.handleEndpointsResponse(response, body);
        assert.strictEqual('https://clienta.client.com/sienge/resteasy/invalid-data-monitor', clientsLinks[0].url);
        assert.strictEqual('https://clientb.client.com/sienge/resteasy/invalid-data-monitor', clientsLinks[1].url);
    });

    it('should extract from each webhook the client ID', function () {
        let siengeClientEndpointsLoader = new SiengeClientEndpointsLoader();

        let response = {
            statusCode : 200
        };

        let body = JSON.stringify(jsonBodyWebhooksExample);

        let clientsLinks = siengeClientEndpointsLoader.handleEndpointsResponse(response, body);
        assert.strictEqual('3906', clientsLinks[0].id);
        assert.strictEqual('4814', clientsLinks[1].id);
    });

    it('should throws when status code is not 200', function() {
        let siengeClientEndpointsLoader = new SiengeClientEndpointsLoader();

        let response = {
            statusCode : 401
        };

        try {
            siengeClientEndpointsLoader.handleEndpointsResponse(response, '');
        } catch (err) {
            assert.notStrictEqual(err, 'status code 401')
        }
    });
});

const jsonBodyWebhooksExample = {
    "_embedded": {
        "webhooks": [{
            "url": "https://clienta.client.com/sienge/api/v1/feature-toggles",
            "_links": {
                "self": {
                    "href": "http://127.0.0.1:8989/webhooks/3906_1"
                },
                "webhook": {
                    "href": "http://127.0.0.1:8989/webhooks/3906_1"
                }
            }
        }, {
            "url": "https://clientb.client.com/sienge/api/v1/feature-toggles",
            "_links": {
                "self": {
                    "href": "http://127.0.0.1:8989/webhooks/4814_1"
                },
                "webhook": {
                    "href": "http://127.0.0.1:8989/webhooks/4814_1"
                }
            }
        }]
    },
    "_links": {
        "first": {
            "href": "http://127.0.0.1:8989/webhooks?page=0&size=1000"
        },
        "profile": {
            "href": "http://127.0.0.1:8989/profile/webhooks"
        }
    },
    "page": {
        "size": 1000,
        "totalElements": 1971,
        "totalPages": 2,
        "number": 0
    }
};