import * as kube from '@kubernetes/client-node'
import { KubernetesObject } from '@kubernetes/client-node'
import { GameServerStatusPort } from '../../agones/v1/gameServer'
import { SchedulingStrategy } from '../../schedulingStrategy'

/** // GameServerAllocationState is the Allocation state */
export enum GameServerAllocationState {
    /** when the allocation successful */
    Allocated = 'Allocated',
    /** when the allocation is unsuccessful */
    UnAllocated = 'UnAllocated',
    /** when the allocation is unsuccessful because of contention */
    Contention = 'Contention',
}

/** GameServerAllocation is the data structure for allocating against a set of
 * GameServers, defined `required` and `preferred` selectors
 */
export type GameServerAllocation = {
    spec: GameServerAllocationSpec
    status: GameServerAllocationStatus
} & KubernetesObject

/** GameServerAllocationList is a list of GameServer Allocation resources */
export type GameServerList = kube.KubernetesListObject<GameServerAllocation>

export type GameServerAllocationSpec = {
    /** MultiClusterPolicySelector if specified, multi-cluster policies are applied.
     * Otherwise, allocation will happen locally. */
    multiClusterSetting: unknown

    /** Required The required allocation. Defaults to all GameServers. */
    required: kube.V1LabelSelector

    /** Preferred ordered list of preferred allocations out of the `required` set.
     * If the first selector is not matched,
     * the selection attempts the second selector, and so on. */
    preferred: kube.V1LabelSelector[]

    /** Scheduling strategy. Defaults to "Packed". */
    scheduling: SchedulingStrategy

    /** MetaPatch is optional custom metadata that is added to the game server at allocation
     * You can use this to tell the server necessary session data */

    metadata: {
        labels: Record<string, string>
        annotations: Record<string, string>
    }
}

export type GameServerAllocationStatus = {
    state: GameServerAllocationState
    gameServerName: string
    ports: GameServerStatusPort[]
    address: string
    nodeName: string
}
