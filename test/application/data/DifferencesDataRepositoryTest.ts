import "reflect-metadata"
import * as assert from 'assert'
import * as rmdir from 'rimraf';
import * as fs from 'fs';
import {DifferencesDataFileRepository} from "../../../src/infrastructure/DifferencesDataFileRepository";

('../../../src/infrastructure/DifferencesDataFileRepository');


process.env.SERVER_FOLDER = __dirname + '/resources/';

describe('Given a repository which manage the differences monitored data', function () {

    beforeEach(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
        fs.mkdirSync(process.env.SERVER_FOLDER);
    });

    after(function () {
        rmdir.sync(process.env.SERVER_FOLDER);
    });

    it('when saves files should store them in the differences folder', function (done) {
        new DifferencesDataFileRepository().store('earth', 'space stone').then(filePath => {
            assert.strictEqual(filePath,process.env.SERVER_FOLDER + 'differences/earth.txt');
            assert.strictEqual(fs.existsSync(filePath), true);
            assert.strictEqual(fs.readFileSync(filePath).toString(),'space stone');
            done();
        })
    });

    it('when read files should read from differences folder', function (done) {
        let differencesDataFileRepository = new DifferencesDataFileRepository();
        differencesDataFileRepository.store('loki', 'tesseract').then(() => {
        differencesDataFileRepository.read('loki').then((data) => {
            assert.strictEqual(data,'tesseract');
            done();
        })});
    });
});