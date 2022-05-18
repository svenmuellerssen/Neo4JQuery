import { IRestAPIConfig } from './IRestAPIConfig';
export declare class RestAPIConfig implements IRestAPIConfig {
    readonly hostname: string;
    readonly port: number;
    readonly protocol: string;
    readonly auth?: string;
    readonly connectionName?: string;
    readonly path?: string;
    readonly method?: string;
    readonly headers?: any;
    readonly autoConnect?: boolean;
    readonly stream: boolean;
    constructor(config: IRestAPIConfig);
}
