import "reflect-metadata"
import * as assert from 'assert';
import * as rmdir from 'rimraf';
import * as fs from 'fs';
import {SiengeDataFetcherRestClient} from "../../src/infrastructure/SiengeDataFetcherRestClient";
import {ClientLink} from "../../src/domain/ClientLink";
import {HttpRequestMockBuilder} from "./HttpRequestMockBuilder";
import {StoreKeeperMock} from "./StoreKeeperMock";

const TEST_INTERVAL_BETWEEN_REQUESTS = 50;
process.env.SERVER_FOLDER = __dirname + '/resources/';

describe('Given a Sienge endpoint accessible by this component', function () {

    beforeEach(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
        fs.mkdirSync(process.env.SERVER_FOLDER);
    });

    after(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
    });

    it('when make http request to an invalid link should not call store keeper', function(done) {
        let mockHttpRequest = new HttpRequestMockBuilder()
            .forUrl('http://gen.client.com').responseWithStatus(500).resultOnError(null).and()
            .forUrl('http://sup.client.com').resultOnError('Fail to call request').responseWithStatus(null).mock();

        let clientsLinksExpected = [new ClientLink('http://gen.client.com', '123'),
                                    new ClientLink('http://sup.client.com', '456')];
        let restClient = new SiengeDataFetcherRestClient(mockHttpRequest, TEST_INTERVAL_BETWEEN_REQUESTS);

        restClient.fetchAllInconsistencies(clientsLinksExpected, {
            store: function() {
                assert.fail("Store keeper should never be called")
            }
        });

        finishTestSuccessfullyAfterThreeTimesIntervalBetweenRequests(done);
    });

    it('when make http requests should wait specified time between them', function(done) {
        let mockHttpRequest = new HttpRequestMockBuilder()
            .forUrl('http://eng.client.com').responseWithStatus(200).andContentBody('eng123').and()
            .forUrl('http://sup.client.com').responseWithStatus(200).andContentBody('sup456').and()
            .forUrl('http://pla.client.com').responseWithStatus(200).andContentBody('pla789').mock();

        let clientsLinksExpected = [new ClientLink('http://eng.client.com', '123'),
                                    new ClientLink('http://sup.client.com', '456'),
                                    new ClientLink('http://pla.client.com', '789')];


        let specifiedTimeBetweenRequests = 80;
        let restClient = new SiengeDataFetcherRestClient(mockHttpRequest, specifiedTimeBetweenRequests);

        let baseTimeInMillis = Date.now();
        let callCount = 0;
        restClient.fetchAllInconsistencies(clientsLinksExpected, {
            store: function() {
                callCount++;
                if(clientsLinksExpected.length === callCount) done();
            }
        });
    });

    it('when receives valid links, should be able to make http requests and chain to a store keeper', function(done) {
        let mockHttpRequest = new HttpRequestMockBuilder()
            .forUrl('http://eng.client.com').responseWithStatus(200).andContentBody('eng123').and()
            .forUrl('http://sup.client.com').responseWithStatus(200).andContentBody('sup456').mock();

        let clientsLinksExpected = [new ClientLink('http://eng.client.com', '123'),
                                    new ClientLink('http://sup.client.com', '456')];

        let storeKeeper = new StoreKeeperMock();
        let restClient = new SiengeDataFetcherRestClient(mockHttpRequest, TEST_INTERVAL_BETWEEN_REQUESTS);
        restClient.fetchAllInconsistencies(clientsLinksExpected, storeKeeper);

        let storedData = [];
        storeKeeper.waitCallback((actualClientName, actualData) => {
            storedData.push({clientName: actualClientName, data: actualData});

            if(storedData.length === clientsLinksExpected.length) {
                assertStoredData('eng', 'eng123', storedData);
                assertStoredData('sup', 'sup456', storedData);
                done();
            }
        })
    });

    it('should build header with basic auth using data from client link', function(done) {
        let mockHttpRequest = new HttpRequestMockBuilder();
        let mockHttpRequestCall = mockHttpRequest
            .forUrl('http://eng.client.com').responseWithStatus(200).andContentBody('eng123').and()
            .forUrl('http://sup.client.com').responseWithStatus(200).andContentBody('sup456').mock();

        let clientsLinksExpected = [new ClientLink('http://eng.client.com', '123'),
                                    new ClientLink('http://sup.client.com', '456')];

        let storeKeeper = new StoreKeeperMock();
        new SiengeDataFetcherRestClient(mockHttpRequestCall, TEST_INTERVAL_BETWEEN_REQUESTS)
            .fetchAllInconsistencies(clientsLinksExpected, storeKeeper);

        let count = 0;
        storeKeeper.waitCallback((clientName) => {
            let headers = mockHttpRequest.requestSettingsFor('http://' + clientName + '.client.com').headers;
            assertHeadersFor(clientName === 'eng' ? '123' : '456', headers);

            count++;
            if(count === 2) done();
        })
    })
});

function assertHeadersFor(clientId, headers) {
    let userAndPasswordEncoded = new Buffer("beaver:" + new ClientLink('', clientId).password()).toString("base64");

    assert.strictEqual(headers["Accept"], 'text/plain');
    assert.strictEqual(headers["Authorization"], 'Basic ' + userAndPasswordEncoded);
}

function assertStoredData(clientName, data, storedData) {
    let expectedRegister = findByClientName(clientName, storedData);
    assert.notStrictEqual(expectedRegister, null);
    assert.strictEqual(expectedRegister.data, data);
}

function findByClientName(clientName, array) {
    for (let element of array) {
        if(element.clientName === clientName) {
            return element;
        }
    }
    return null;
}

function finishTestSuccessfullyAfterThreeTimesIntervalBetweenRequests(done) {
    setTimeout(function () {
        done();
    }, TEST_INTERVAL_BETWEEN_REQUESTS * 3)
}

