# Neo4jQuery
Tool that handles cypher syntax as method calls

# What is Neo4jQuery?
Neo4jQuery is a simple implementation based on the cypher query language used in the graph database system Neo4J. 

#Why Neo4jQuery
I implemented this wrapper class for the Neo4J query language because seraph can not perform a delete of a node and/or relationship in NodeJS with cypher.

It is nice too that the Cypher query can be split by just method calls and not by concatenating a query string.

All methods except 'Query' return the wrapper class itself so you can chain your method calls.

# How to use
1. Download repository into a library folder (later it should be a npm module).
2. Install the module `underscore` via __npm install underscore__.
3. Install the module `seraph` via __npm install seraph__.
4. Import both, seraph and Neo4jQuery, with 'require' and connect to your Neo4J graph database.
5. You can write your own module to wrap the methods of Neo4JQuery and import your own small module.

__Quick example__
```javascript
var seraph = require("seraph")({
	"http://localhost:7474",
  	user: configurationParams.app.db.user,
  	pass: configurationParams.app.db.pass
    })
    , graph = require(<path to Neo4jQuery>).singleton(seraph);

```

#Documentation
<a name="setConnection" />
### setConnection(connection)
Sets a driver which is connected to a Neo4j database. The only requirement is that the driver implements a method called 'query'.

__Arguments__

* `connection` (object) - A driver with a connection to a Neo4j database

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()

    graph.setConnection(<driver object>);
```

<a name="query" />
### Query(query, parameters, callback)
Executes a given query directly. Using parameters for parameterized cypher queries.

__Arguments__

* `query` (string) - The cypher query to be executed.
* `parameters` (object) - Parameters for parameterized queries.
* `callback` (function) - Callback function with parameters 'error' and 'array list'.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    , query = "MATCH (n:Node) WHERE n.field1=? AND r.field2=? RETURN n"
    , parameters = ["value1", "value2"]

    graph
      .reset()
      .Query(query, parameters, function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="match" />
### Match(placeholder, label, parameters)
Matches data specified through labels and parameters and bound to the placeholder.

__Arguments__

* `placeholder` (string) - The placeholder of the node or relationship.
* `label` (string) - The labels which are assigned to nodes.
* `parameters` (object) - Parameters to filter nodes.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('n', 'node', {field1: '...', field2: '...'})
      .run(['n'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="merge" />
### Merge(placeholder, label, parameters)
Try to create and insert new node with given parameters and label.

__Arguments__

* `placeholder` (string) - The placeholder of the node.
* `label` (string) - The labels which are assigned to the node.
* `parameters` (object) - Parameters of the node.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Merge('n', 'Node', {field1: '...', field2: '...', createdAt: 120987654321})
      .run(['n'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="mergerelationship" />
### MergeRelationShip(nodes, placeholder, label, parameters)
Try connect two nodes with a relationship with given information

__Arguments__

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.
* `placeholder` (string) - The placeholder of the relationship.
* `label` (string) - The labels which are assigned to the relationship.
* `parameters` (object) - Parameters of the relationship.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .MergeRelationShip(['n', 'u'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'})
      .run(['n', 'u', 'r'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="set" />
### Set(placeholder, parameter)

Sets given properties to a node or relationship.

__Arguments__

* `placeholder` (string) - The placeholder of the node or relationship.
* `parameter` (object) - All parameters to be set as properties in the node or relationship.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('n', 'User', {username: 'neo4jqueryuser', password: 'password'})
      .Set('n', {createdAt: 1440360134452, updatedAt: 1440360134452})
      .run(['n'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

