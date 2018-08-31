import {ClientLink} from "../domain/ClientLink";

export interface SiengeEndpointsRepository {

    retrieveEndpoints() : Promise<ClientLink[]>;
}