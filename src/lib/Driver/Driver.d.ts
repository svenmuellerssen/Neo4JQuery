import { RestAPIConfig } from './Rest/RestAPIConfig';
import { BoltConfig } from './Bolt/BoltConfig';
import { Rest } from './Rest/Rest';
import { Bolt } from './Bolt/Bolt';
export declare abstract class Driver {
    static readonly DRIVER_TYPE_HTTP: number;
    static readonly DRIVER_TYPE_BOLT: number;
    abstract getType(): number;
    abstract setGraphTypes(types?: any): Bolt | Rest;
    abstract connect(configuration: RestAPIConfig | BoltConfig | null | undefined): Rest | Bolt;
    abstract execute(sessionName: string, query: string, parameter: any): Promise<any>;
    abstract close(): Bolt | Rest;
}
