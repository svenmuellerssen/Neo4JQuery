import * as Neo4J from "neo4j-driver";
export interface SessionPool {
    [sessionName: string]: Neo4J.v1.Session;
}
