import * as kube from '@kubernetes/client-node'
import * as agones from './types/agones/v1/client'
import * as allocation from './types/allocation/v1/client'

export class ClientSet {
    restClient: kube.CustomObjectsApi
    agonesv1: agones.AgonesV1Client
    allocationv1: allocation.AllocationV1Client

    constructor(
        restClient: kube.CustomObjectsApi,
        agonesv1: agones.AgonesV1Client,
        allocationv1: allocation.AllocationV1Client,
    ) {
        this.restClient = restClient
        this.agonesv1 = agonesv1
        this.allocationv1 = allocationv1
    }

    static NewForConfig(config: kube.KubeConfig): ClientSet {
        const client = config.makeApiClient(kube.CustomObjectsApi)
        const agonesv1 = agones.AgonesV1Client.NewForConfig(client)
        const allocationv1 = allocation.AllocationV1Client.NewForConfig(client)

        return new ClientSet(client, agonesv1, allocationv1)
    }
}
