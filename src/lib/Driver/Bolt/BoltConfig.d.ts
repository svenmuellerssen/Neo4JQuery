import { IBoltConfig } from './IBoltConfig';
export declare class BoltConfig implements IBoltConfig {
    readonly server: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly autoConnect: boolean;
    readonly connectionName: string;
    constructor(config: IBoltConfig);
}
