import * as kube from '@kubernetes/client-node'
import { KubernetesObject } from '@kubernetes/client-node'
import { SchedulingStrategy } from '../../schedulingStrategy'

export const ErrContainerRequired = 'Container is required when using multiple containers in the pod template'
export const ErrHostPort = 'HostPort cannot be specified with a Dynamic or Passthrough PortPolicy'
export const ErrPortPolicyStatic = 'PortPolicy must be Static'
export const ErrContainerPortRequired = 'ContainerPort must be defined for Dynamic and Static PortPolicies'
export const ErrContainerPortPassthrough = 'ContainerPort cannot be specified with Passthrough PortPolicy'
export const ErrContainerNameInvalid = 'Container must be empty or the name of a container in the pod template'

export enum GameServerState {
    PortAllocation = 'PortAllocation',
    Creating = 'Creating',
    Starting = 'Starting',
    Scheduled = 'Scheduled',
    RequestReady = 'RequestReady',
    Ready = 'Ready',
    Error = 'Error',
    Unhealthy = 'Unhealthy',
    Shutdown = 'Shutdown',
    Allocated = 'Allocated',
}

export enum PortPolicy {
    Static = 'Static',
    Dynamic = 'Dynamic',
    Passthrough = 'Passthrough',
}

export enum corev1_Protocol {
    UDP = 'UDP',
    TCP = 'TCP',
    TCPUDP = 'TCPUDP',
}

export enum SdkServerLogLevel {
    // SdkServerLogLevelInfo will cause the SDK server to output all messages except for debug messages.
    'Info' = 'Info',
    // SdkServerLogLevelDebug will cause the SDK server to output all messages including debug messages.
    'Debug' = 'Debug',
    // SdkServerLogLevelError will cause the SDK server to only output error messages.
    'Error' = 'Error',
}

export type GameServer = {
    spec: GameServerSpec
    status: GameServerStatus
} & KubernetesObject

export type GameServerList = kube.KubernetesListObject<GameServer>

export type GameServerTemplateSpec = {
    spec: GameServerSpec
} & kube.KubernetesObject

export type GameServerSpec = {
    container: string
    ports: GameServerPort[]
    health: Health
    scheduling: SchedulingStrategy
    sdkServer: SdkServer
    template: kube.V1PodTemplateSpec
}

export type Health = {
    // Disabled is whether health checking is disabled or not
    disabled: boolean
    // PeriodSeconds is the number of seconds each health ping has to occur in
    periodSeconds: number
    // FailureThreshold how many failures in a row constitutes unhealthy
    failureThreshold: number
    // InitialDelaySeconds initial delay before checking health
    initialDelaySeconds: number
}

export type GameServerPort = {
    // Name is the descriptive name of the port
    name: string
    // PortPolicy defines the policy for how the HostPort is populated.
    // Dynamic port will allocate a HostPort within the selected MIN_PORT and MAX_PORT range passed to the controller
    // at installation time.
    // When `Static` portPolicy is specified, `HostPort` is required, to specify the port that game clients will
    // connect to
    portPolicy: PortPolicy
    // Container is the name of the container on which to open the port. Defaults to the game server container.
    // This field is beta-level and is enabled by default, could be disabled by the "ContainerPortAllocation" feature.
    // +optional
    container?: string
    // ContainerPort is the port that is being opened on the specified container's process
    containerPort: number
    // HostPort the port exposed on the host for clients to connect to
    hostPort?: number
    // Protocol is the network protocol being used. Defaults to UDP. TCP and TCPUDP are other options.
    protocol: corev1_Protocol
}

export type SdkServer = {
    // LogLevel for SDK server (sidecar) logs. Defaults to "Info"
    logLevel: SdkServerLogLevel
    // GRPCPort is the port on which the SDK Server binds the gRPC server to accept incoming connections
    gRPCPort: number
    // HTTPPort is the port on which the SDK Server binds the HTTP gRPC gateway server to accept incoming connections
    hTTPPort: number
}

export type GameServerStatus = {
    // GameServerState is the current state of a GameServer, e.g. Creating, Starting, Ready, etc
    state: GameServerState
    ports: GameServerStatusPort[]
    address: string
    nodeName: string
    reservedUntil: unknown
}

export type GameServerStatusPort = {
    name: string
    port: number
}
