import * as kube from '@kubernetes/client-node'
import { GameServers } from './gameServer'

export class AgonesV1Client {
    client: kube.CustomObjectsApi

    constructor(client: kube.CustomObjectsApi) {
        this.client = client
    }

    gameServers(namespace: string): GameServers {
        return new GameServers(this, namespace)
    }

    static NewForConfig(client: kube.CustomObjectsApi): AgonesV1Client {
        return new AgonesV1Client(client)
    }
}
