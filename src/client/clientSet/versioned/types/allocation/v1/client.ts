import * as kube from '@kubernetes/client-node'
import { GameServerAllocations } from './gameServerAllocations'

export class AllocationV1Client {
    client: kube.CustomObjectsApi

    constructor(client: kube.CustomObjectsApi) {
        this.client = client
    }

    gameServerAllocations(namespace: string): GameServerAllocations {
        return new GameServerAllocations(this, namespace)
    }

    static NewForConfig(client: kube.CustomObjectsApi): AllocationV1Client {
        return new AllocationV1Client(client)
    }
}
