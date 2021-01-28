import { AllocationV1Client } from './client'
import { HttpError } from '@kubernetes/client-node'
import { PartialRecursive } from '../../../../../../utils'
import * as v1 from '../../../../../../apis/allocation/v1'

export class KubeApiError extends Error {
    constructor(httpError: HttpError) {
        super(`${httpError.message} (${httpError.statusCode}): ${httpError.body.message || 'Unknown'}`)
    }
}

export class GameServerAllocations {
    client: AllocationV1Client
    namespace: string

    constructor(client: AllocationV1Client, namespace: string) {
        this.client = client
        this.namespace = namespace
    }

    async create(gameServerAllocation: PartialRecursive<v1.GameServerAllocation>): Promise<v1.GameServerAllocation> {
        const { body } = await this.client.client
            .createNamespacedCustomObject('allocation.agones.dev', 'v1', this.namespace, 'gameserverallocations', {
                apiVersion: 'allocation.agones.dev/v1',
                kind: 'GameServerAllocation',
                ...gameServerAllocation,
            })
            .catch((e) => {
                if (e instanceof HttpError) throw new KubeApiError(e)
                throw e
            })

        return body as v1.GameServerAllocation
    }
}
