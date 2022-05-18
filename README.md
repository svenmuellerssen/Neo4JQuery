# Neo4jQuery
Tool that handles cypher syntax as method calls.

# What is Neo4jQuery?
˙Neo4JQuery˙ is an implementation made to to use the query language 'Cypher' of the graph database ˙Neo4J˙ only.

#Why Neo4jQuery
The library provides the strength of Cypher to use batch functionality
like multiple matches and merges and creating relationships in one query.

It is also made to be more like programming a Cypher query than have lots of Cypher strings in the code which
 could be confusing.

Therefor you have lots of methods available in the query builder object which can be chained and
is looking like a real cypher command in the end.

# How to use
1. Download repository into a library folder (later it should be a npm module).
2. Install the module `underscore` via __npm install underscore__.
3. Install the driver module like `seraph` via __npm install seraph__.
4. Import both, `seraph` and `Neo4jQuery`, with 'require' and connect to your Neo4J graph database.

__Quick example to get connection__
```javascript
var seraph = require("seraph")({
      server: "http://127.0.0.1:7474",
      endpoint: "/data/graph.db",
      user: "testuser",
      pass: "testpass"
      })
  , graph = require("neo4jquery").setConnection(seraph);

```

# Documentation

## Graph
<a name="setConnection" />
### setConnection(connection)

Sets a driver which is connected to a Neo4J database.
The only requirement is that the driver implements a method called 'query'.

__Arguments__

* `connection` (object) - A driver with a connection to a Neo4J database

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>);
```

<a name="query" />
### Query(query, parameters, callback)

Executes a passed-in query directly. Using parameters for parameterized cypher queries.

__Arguments__

* `query` (string) - The cypher query to be executed.
* `parameters` (object) - Parameters for parameterized queries.
* `callback` (function) - Callback function with parameters 'error' and 'array list'.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , query = "MATCH (n:Node {field1: {v1}})-[r1:IS_LABEL]-(n2:Node2 {field2: {v2}}) RETURN n"
  , parameters = {v1: "value1", v2: "value2"}

  graph.Query(query, parameters, function(err, list) {
      if (err || void 0 === list) {
        callback(err, void 0);
      } else {
        // some stuff here with list
        var user = list[0];
      }
    });
```

<a name="call" />
### Call(domain, procedureName, callback)

Calls a stored procedure in the graph database (available at v3.0 of Neo4J).
It is also possible to pass-in the two parts of the procedure name only in domain like `domain = 'com.example.test.lib.hasRelation()'`.

__Arguments__

* `domain` (string) - The domain part of the stored procedure like 'com.example.test.lib'.
* `procedureName` (string) - The name of the procedure as function call ('hasRelation()').
* `callback` (function) - Callback function with parameters 'error' and result as array list.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , domain = "com.example.test.lib"
  , procedureName = "hasRelation()";

  graph.Call(domain, procedureName, function(err, list) {
      if (err || void 0 === list) {
        callback(err, void 0);
      } else {
        // some stuff here with list
        var user = list[0];
      }
    });
```

Or you can shorten the call by using this:

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , completeProcedureName = "com.example.test.lib.hasRelation()";

  graph.Call(completeProcedureName, function(err, list) {
      if (err || void 0 === list) {
        callback(err, void 0);
      } else {
        // some stuff here with list
        var user = list[0];
      }
    });
```

<a name="builder" />
### Builder

The Cypher builder object.

__Arguments__

* No arguments

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder;

  ...
  ...
```

<a name="run" />
### run(builder, cached, callback)

Sets conditions to find specific nodes or relationships.

__Arguments__

* `builder` (Builder) - Cypher query builder object.
* `cached` (bool) - Flag to use the last cypher query.
* `callback` (function) - The callback function. Parameter of this function are first an error object and second an array as resultset.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('n', 'User')
    .Where("n.username={username} and n.password={password}", {username: "testuser", password: "testpass"})

  graph.run(builder, false, function(err, list) {
    if (err || void 0 === list) {
      callback(err, void 0);
    } else {
      // some stuff here with list
      var user = list[0];
    }
  });
```

<a name="execute" />
### execute(options)

Executes the query and returns result set.

__Arguments__

* `options` (Object) - An config object with needed settings.
- `builder` (Builder) - The Cypher query builder you created the query with.
- `cached` (boolean) - Flag set to false for default. Set to true Neo4JQuery will use the last cached query for execution.
- `aliases` (Object) - Setting with aliases for the returned result placeholder
- `success` (function) - Callback function used if query was successful.
- `error` (function) - Callback function used if query was unsuccessful.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

    builder
      .reset()
      .Match('u', 'User', {username: "testuser", password: "testpass"});

    graph.execute({
      builder: builder,
      cached: false,
      aliases: {
        u: 'user'
      },
      success: function(results) {...},
      error: function(err) {...}
    });
```

## Cypher Builder

<a name="reset" />
### reset()

Resets the builder object (inclusive cached query). Should be used to be as first method in the chain when you get the builder object.

__Arguments__

* No arguments

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder.reset();
```

<a name="match" />
### Match(placeholder, label, optional, parameters)
Matches data specified through labels and parameters and bound to the placeholder.

__Arguments__

* `placeholder` (string) - The placeholder of the node or relationship.
* `label` (string) - The labels which are assigned to nodes.
* `optional` (boolean) - Flag to use 'OPTIONAL MATCH'. Default is `false`.
* `parameters` (object) - Parameters to filter nodes.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('n', 'node', false, {field1: '...', field2: '...'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      n: 'node'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="optionalmatch" />
### OptionalMatch(placeholder, label, parameters)
Matches data specified through labels and parameters and bound to the placeholder.
If there is no information found the placeholder will be null.

__Arguments__

* `placeholder` (string) - The placeholder of the node or relationship.
* `label` (string) - The labels which are assigned to nodes.
* `optional` (boolean) - Flag to use 'OPTIONAL MATCH'. Default is `false`.
* `parameters` (object) - Parameters to filter nodes.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .OptionalMatch('n', 'node', {field1: '...', field2: '...'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      n: 'node'
    },
    success: function(results) {...},
    error: function(err) {...}
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
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: '...', field2: '...', createdAt: 120987654321});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
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
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', false, {field1: ..., field2: ...})
    .With(['u'])
    .Merge('n', 'Node', false, {field1: '...', field2: '...', createdAt: 120987654321})
    .With(['u', 'n'])
    .MergeRelationShip(['n', 'u'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node',
      r: 'relation'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="oncreate" />
### onCreate(command)
Event used with _Merge_ to be executed if _Merge_ creates a new node/relationship.


__Arguments__

* `command` (string) - The command like _SET_ followed by what to do.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: ..., field2: ...})
    .relate('r1', 'GUESSED_RELATIONSHIP')
    .toNode('n', 'Note', {field3: ..., field4: ...})
    .onCreate('SET u.createdAt=timestamp(), n.createdAt=timestamp()');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="onmatch" />
### onMatch(command)
Event used with _Merge_ to be executed if _Merge_ matches a node.


__Arguments__

* `command` (string) - The command like _SET_ followed by what to do.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: ..., field2: ...})
    .relate('r1', 'GUESSED_RELATIONSHIP')
    .toNode('n', 'Note', {field3: ..., field4: ...})
    .onMatch('SET u.visited=timestamp(), n.visited=timestamp()');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="delete" />
### Delete(placeholder)
Deletes all the given nodes/relationships.
Please take care of the order of relationships and nodes you want to remove.

__Arguments__

* `placeholder` (string|array) - The placeholder of node/nodes to be deleted.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', {...})
    .relate('r1', 'RELATIONSHIP', {...})
    .toNode('u2', 'User', {...})
    .Delete(['r1', 'u', 'u2']);

  graph.execute({
    builder: builder,
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="with" />
### With(placeholders)
Sets a driver which is connected to a Neo4j database. The only requirement is that the driver implements a method called 'query'.

__Arguments__

* `placeholders` (array) - An array with all placeholders which have to be connected with next cypher command.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', {username: 'neo4jqueryuser', password: 'password'})
    .With(['u'])
    .MergeRelationShip(['u'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      r: 'relation'
    },
    success: function(results) {...},
    error: function(err) {...}
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
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.username={username} and u.password={password}", {username: 'testuser', password: 'password'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
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
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.username={username} and u.password={password}", {username: 'testuser', password: 'password'})
    .Set('u', {createdAt: 1440360134452, updatedAt: 1440360134452});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="foreachcondition" />
### ForeachCondition(condition, query)

Adds a cypher foreach loop to the query to update the nodes in a list.

__Arguments__

* `condition` (string) - The condition to iterate over a list of nodes.
* `query` (string) - The update command.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.updatedAt > {timestamp}", {timestamp: new Date().getTime() - 3600})
    .ForeachCondition('user IN u', 'SET u.visited=true');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```
<a name="remove" />
### Remove(placeholder, parameter)

Remove given properties from a node

__Arguments__

* `placeholder` (string) - The placeholder of the node.
* `parameter` (object) - All parameters to be set as properties or labels in the node.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.username={username} and u.password={password}", {username: 'testuser', password: 'password'})
    .Remove('u', {property: 'username'});

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="skip" />
### Skip(parameter)

Remove given properties from a node

__Arguments__

* `parameter` (expresion) - Any expression that evaluates to a positive integer 
— however the expression cannot refer to nodes or relationships.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Return('u')
    .Skip(2);

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="skip" />
### Limit(parameter)

Remove given properties from a node

__Arguments__

* `parameter` (expresion) - Any expression that evaluates to a positive integer 
— however the expression cannot refer to nodes or relationships.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Return('u')
    .Limit(3);

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="skip" />
### Sort(placeholder, parameters, direction)

Remove given properties from a node

__Arguments__

* `placeholder` (string) - The placeholder of the node.
* `parameter` (array) - All properties to sort by the output.
* `direction` (string) - Value to set the order direction (ASC | DESC).

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Return('u')
    .Sort('u', ['name'], 'DESC');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="return" />
### Return(aliases)

Return given aliases as a response

__Arguments__

* `aliases` (array) - The aliases of the query to be returned. 
If empty, it will return the placeholders found in the query??

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Return('u');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

<a name="return" />
### Create(placeholder, labels, parameters)

Creates a single or multiple nodes, set label/s and properties 

__Arguments__

* `placeholder` (string) - The placeholder of the node.
* `labels` (array) - All labels to be created.
* `parameters` (object) - Properties to be set in the nod e.

__Example__

```javascript
var graph = require("neo4jquery").setConnection(<driver object>)
  , builder = graph.Builder();

  builder
    .reset()
    .Create('u', ['User', 'Developer'], {name: 'John Doe'})
    .Return('u');

  graph.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {...},
    error: function(err) {...}
  });
```

