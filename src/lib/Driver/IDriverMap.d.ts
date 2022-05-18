import { Bolt } from './Bolt/Bolt';
import { Rest } from './Rest/Rest';
/**
 * Map of named driver connections.
 * @todo Will be replaced by built-in datatype "Map".
 */
export interface IDriverMap {
    [name: string]: Bolt | Rest;
}
