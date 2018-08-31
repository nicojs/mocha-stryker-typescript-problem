import {injectable, unmanaged} from "inversify";

let fs = require('fs');
let rimraf = require('rimraf');

const FILE_FORMAT = '.txt';

@injectable()
class DefaultFileRepository {

    private folder: string;

    constructor(@unmanaged() folder) {
        this.folder = folder;
        this.makeDirWhenNecessary();
    }

    public store(clientName : string, data : string) : Promise<string> {
        let filePath = this.buildFilePath(clientName);

        return new Promise(function(resolve, reject) {
            fs.writeFile(filePath, data, err => {
                if(err) reject(err);
                resolve(filePath);
            });
        })
    }

    public read(clientName : string) : Promise<string> {
        let filePath = this.buildFilePath(clientName);

        return new Promise(function(resolve, reject) {
            if(fs.existsSync(filePath)) {
                fs.readFile(filePath, function(err, data) {
                    resolve(data.toString());
                })
            } else {
                resolve('');
            }
        })
    }

    public list() : Promise<string[]> {
        let path = this.path();

        return new Promise(function(resolve, reject) {
            fs.readdir(path, function(err, files) {
                if(err) reject(err);
                resolve(files);
            })
        })
    }

    public clear() {
        console.log('DefaultFileRepository::Cleaning this.folder');
        rimraf.sync(this.path());
    }

    private buildFilePath(clientName) {
        if (clientName.indexOf(FILE_FORMAT) > -1) {
            clientName = clientName.replace(FILE_FORMAT, '');
        }

        return this.path() + clientName + FILE_FORMAT;
    }

    private path() {
        return process.env.SERVER_FOLDER + this.folder;
    }

    private makeDirWhenNecessary() {
        if (!fs.existsSync(this.path())) {
            fs.mkdirSync(this.path());
        }
    }
}

export { DefaultFileRepository }