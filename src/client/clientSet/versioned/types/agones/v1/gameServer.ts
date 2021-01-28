import { AgonesV1Client } from './client'
import { HttpError } from '@kubernetes/client-node'
import { PartialRecursive } from '../../../../../../utils'
import * as v1 from '../../../../../../apis/agones/v1'

export class KubeApiError extends Error {
    httpError: HttpError

    constructor(httpError: HttpError) {
        super(`${httpError.message} (${httpError.statusCode}): ${httpError.body.message || 'Unknown'}`)
        this.httpError = httpError
    }
}

export class GameServers {
    client: AgonesV1Client
    namespace: string

    constructor(client: AgonesV1Client, namespace: string) {
        this.client = client
        this.namespace = namespace
    }

    async create(gameServer: PartialRecursive<v1.GameServer>): Promise<v1.GameServer> {
        const { body } = await this.client.client
            .createNamespacedCustomObject('agones.dev', 'v1', this.namespace, 'gameservers', {
                apiVersion: 'agones.dev/v1',
                kind: 'GameServer',
                ...gameServer,
            })
            .catch((e) => {
                if (e instanceof HttpError) throw new KubeApiError(e)
                throw e
            })

        return body as v1.GameServer
    }

    async get(name: string): Promise<v1.GameServer> {
        const { body } = await this.client.client
            .getNamespacedCustomObject('agones.dev', 'v1', this.namespace, 'gameservers', name)
            .catch((e) => {
                if (e instanceof HttpError) throw new KubeApiError(e)
                throw e
            })

        return body as v1.GameServer
    }

    async list(): Promise<v1.GameServerList> {
        const { body } = await this.client.client
            .listNamespacedCustomObject('agones.dev', 'v1', this.namespace, 'gameservers')
            .catch((e) => {
                if (e instanceof HttpError) throw new KubeApiError(e)
                throw e
            })

        return body as v1.GameServerList
    }
}
