import { IBoltConfig } from '../src/lib/Driver/Bolt/IBoltConfig';
import { IRestAPIConfig } from '../src/lib/Driver/Rest/IRestAPIConfig';

export class TestConfiguration
{
  public readonly bolt: IBoltConfig = {
    server: '127.0.0.1',
    user: "neo4j",
    password: "neo4j",
    port: 7687,
    connectionName: 'testConnectionBolt',
    autoConnect: false
  };

  public readonly rest: IRestAPIConfig = {
    hostname: "127.0.0.1",
    port: 7474,
    protocol: 'http://',
    path: "/db/data/transaction/commit",
    method: 'POST',
    auth: "neo4j:neo4j",
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json',
      'Content-Length': 0
    },
    stream: true,
    autoConnect: false,
    connectionName: 'testConnectionRest'
  };
}