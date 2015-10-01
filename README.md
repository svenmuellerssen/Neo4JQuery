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
<a name="reset" />
### reset()
Resets the complete graph object except connection.

__Arguments__


__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    , query = "MATCH (n:Node) WHERE n.field1=? AND r.field2=? RETURN n"
    , parameters = ["value1", "value2"]

    graph.reset();
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
      .run(['n', ...], function(err, list) {
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
      .Merge('n', 'User', {field1: '...', field2: '...', createdAt: 120987654321})
      .run(['n', ...], function(err, list) {
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
Try connect two nodes with a relationship with given information.


__Arguments__

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.
* `placeholder` (string) - The placeholder of the relationship.
* `label` (string) - The labels which are assigned to the relationship.
* `parameters` (object) - Parameters of the relationship.

__Example__

```javascript
// Here the first value in the nodes array points to the second value 
// via relationship 'ASSIGNED_WITH_EACH_OTHER'!
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('u', 'User', {field1: ..., field2: ...})
      .With(['u'])
      .Merge('n', 'Node', {field1: '...', field2: '...', createdAt: 120987654321})
      .With(['u', 'n'])
      .MergeRelationShip(['n', 'u'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'})
      .run(['n', 'u', ...], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="delete" />
### Delete(placeholder)
Try to delete all the given nodes/relationships.
__Please do not use this method. Not stable!__

__Arguments__

* `placeholder` (string|array) - The placeholder of node/nodes to be deleted.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('u', 'User', {...})
      .With(['u'])
      .Match('u2', 'User', {})
      .With(['u', 'u2'])
      .Delete(['u', 'u2', ...])
      .run([], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="delete2" />
### delete(obj, callback)
Deletes the node object. This overrides the NodeJS driver method and pass-through the parameters.

At the moment the method awaits a seraph node object but will be adapted to only pass-in a javascript literal object.

__Please don't use this function. It is not working properly now.__

__Arguments__

* `obj` (object) - the node object that has to be deleted.
* `callback` (function) - The callback function for async processing.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .delete({field1: ..., field2: ...}, function(err) {
        if (err) {
          callback(err, void 0);
        } else {
          // do some stuff here
        }
      });
```

<a name="with" />
### With(placeholders)

Sets a driver which is connected to a Neo4j database. The only requirement is that the driver implements a method called 'query'.

__Arguments__

* `placeholders` (array) - An array with all placeholders which have to be connected with next cypher command.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()

    graph
	.reset()
	.Match('n', 'User', {username: 'neo4jqueryuser', password: 'password'})
	.With(['n', ...])
	.MergeRelationShip(['n', ...], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'})
	.run(['n', ...], function(err, list) {
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

<a name="where" />
### Where(placeholder, parameter)

Sets conditions to find specific nodes or relationships.

__Arguments__

* `string` (string) - The conditions to filter nodes and/or relationships.
* `parameter` (object) - The parameters for prepared cypher statements provided by the NodeJS driver.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('n', 'User', {username: 'neo4jqueryuser', password: 'password'})
      .Where("n.username={neo4jqueryuser} and n.password={password}", {neo4jqueryuser: '...', password: '...'})
      .run(['n'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```

<a name="run" />
### run(placeholder, cached, callback)

Sets conditions to find specific nodes or relationships.

__Arguments__

* `placeholder` (array) - All nodes/relationships that have to be returned.
* `cached` (bool) - Flag to use the last cypher query.
* `callback` (function) - The callback function. Parameter of this function are first an error object and second an array as resultset.

__Example__

```javascript
var graph = require(<path to Neo4JQuery>).singleton()
    graph
      .reset()
      .Match('n', 'User', {username: 'neo4jqueryuser', password: 'password'})
      .Where("n.username={neo4jqueryuser} and n.password={password}", {neo4jqueryuser: '...', password: '...'})
      .run(['n'], function(err, list) {
        if (err || void 0 === list) {
          callback(err, void 0);
        } else {
          // some stuff here with list
          var user = list[0];
        }
      });
```
