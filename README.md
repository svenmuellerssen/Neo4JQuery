<h1>Neo4JQuery</h1>
Tool that handles cypher syntax as method calls.

<h2>What is Neo4JQuery?</h2>

<i>Neo4JQuery</i> is an implementation made to use the query language <i>Cypher</i> of the graph database <i>Neo4J</i>.

<h2>Why Neo4JQuery</h2>

The library provides the strength of <i>Cypher</i> to use batch functionality like multiple matches and merges and creating relationships
in one query.

It is also made to be more like programming a <i>Cypher</i> query than have many <i>Cypher</i> strings in the code which could be confusing.

Therefor you have lots of methods available in the query builder which can be chained and is looking like a real <i>Cypher</i> command in the end.

The query builder methods are named like the <i>Cypher</i> commands, e.g. "<i>Merge</i>", "<i>Match</i>",  "<i>Set</i>" or "<i>onCreate</i>".

<p style="font-size: 0.9em; color: red">!Important: Version 1.0.3 is not supported anymore. Instead use version 1.2.0 and later!</p>

<h2>How to use</h2>

<h3>Import into your own <i>NodeJS</i> project</h3>

- Add the <i>Neo4JQuery</i> module to the dependencies list in your project <i>package.json</i> file.
- Execute `npm install` to pull the module and install it in your project.

<h3>Install globally to use in different projects</h3>

- If you need it globally use __npm -g install Neo4JQuery__.

<h3>Quick example for usage with Bolt</h3>

```javascript  
  var db = require('Neo4JQuery').singleton({
        server: "bolt://localhost",
        user: "boltTest",
        password: "changePassword",
        port: 7475,
        type: Driver.DRIVER_TYPE_BOLT,
        connection: 'default'
      })
      , Builder = db.Builder;
  
  Builder
    .reset()
    .Match(...);
    
  ... 
  
```

Alternatively you can use it like this:

```javascript
  var db = require('Neo4JQuery').singleton()
    , Builder = db.Builder;
    
  db.connect({
    server: "bolt://localhost",
    user: "boltTest",
    password: "changePassword",
    port: 7475,
    type: Driver.DRIVER_TYPE_BOLT,
    connection: 'default'
  });
      
  Builder
    .reset()
    .Match(...);
    
  ...
  
```


<h2>Documentation</h2>
<h3>Driver</h3>

<h4>Bolt</h4>
Bolt is a binary connection protocol. For more infos check the page at the <a href="https://neo4j.com/developer/javascript/#_neo4j_for_javascript_developers">Neo Technology, Inc. </a>homepage.
This official driver is used internally to connect your application with your `Neo4J` database.

<h4>Return values</h4>

```javascript  
  var db = require('Neo4JQuery').singleton({
        server: "127.0.0.1",
        user: "boltTest",
        password: "changePassword",
        port: 7687,
        connection: 'default'
      })
      , Builder = db.Builder;
  
  Builder
    .reset()
    .Match(...);
    
  db.execute({
    builder: Builder,
    connection: 'readServer',
    cached: false,
    labelMap: {'u1': 'User'},
    closeConnection: false // Default: false. Otherwise the bolt connection is closed internally. 
    success: function(data) {
      /**
       * TODO: HERE THE STRUCTURE OF THE RESULT SET DEPENDING ON THE USED DRIVER!!!
       *
       */
       db.close();
    },
    error: function(err) {db.close();}
  });
  
  
```

<h4>REST</h4>
To connect your application with your `Neo4J` database via REST `Neo4JQuery` uses the `<MODULE_NAME>` module. It is a lightweight and fast driver offering full support to the needs of `Neo4JQuery`.

<h4>Return values</h4>

```javascript
var db = require('Neo4JQuery').singleton({
    server: "https://localhost",
    endpoint: "/db/data/",
    user: "neo4j",
    password: "neo4j",
    port: 7474,
    type: Driver.DRIVER_TYPE_REST,
    connection: 'readServer'
  });
  , Builder = db.Builder;
  
  Builder
    .reset()
    .Match('u1', 'User', {username: 'test'}, false)
    .Set('u1', {processed: true});
    
  db.execute({
    builder: Builder,
    connection: 'readServer',
    cached: false,
    labelMap: {'u1': 'User'},
    success: function(data) {
      /**
       * TODO: HERE THE STRUCTURE OF THE RESULT SET DEPENDING ON THE USED DRIVER!!!
       *
       */
    },
    error: function(err) {...}
  });
```

<h3>Graph</h3>

<h4>connect(connection)</h4>
Connects to the configured database. The standard driver is based on REST for legacy purposes. Therefor `Neo4JQuery` uses the module `<MODULE_NAME>`.
As you can see in the example you also can use a bolt driven connection. Here `Neo4JQuery` use the official module `neo4j-driver` from `<COMPANY_NAME_OF_NEO4J>`.
If you need more than one connections to one or more databases you only have to define the `connection name` as it is shown in the example.

<strong>Arguments</strong>

* `connection` (object) - Connection configuration
  * `server` (string) - The server URL (Pay attention to the protocols for REST and Bolt!)
  * `port` (number) - The port the server is listening on
  * `user` (string) - The user name for server authentication.
  * `password` (string) - The password for server authentication
  * `type` (number) - The driver type. Default: `DRIVER_TYPE_REST`. For Bolt usage use `DRIVER_TYPE_BOLT`
  * `connection` (string) - The connection name for different connection to one or more database servers.

  
<strong>Example</strong>

See quick example...

<a name="close"></a>
<h4>close(connection)</h4>

Closes the connection to a database of the specified driver. To close a connection use also can use the parameter `closeConnection` in the options passed-in to the method <a href="#execute">execute</a>.

<strong>Arguments</strong>

* `connection` (string) - The connection name.

<strong>Example</strong>

```javascript
var db = require('Neo4JQuery').singleton()
  , db.connect({...})
      , Builder = db.Builder;
  
  Builder
    .reset()
    .Match(...);
    
  db.execute(...);
  
  ...
  
  db.close('readServer');
```
<a name="query"></a>

<h4>query(query, parameters [, connection], callback)</h4>

Executes a passed-in query directly. It is also using parameters for parameterized cypher queries. 
If you are using the `Bolt` driver the connection is closed automatically before executing the callback function.

<strong>Arguments</strong>

* `query` (string) - The cypher query to be executed.
* `parameters` (object) - Parameters for parameterized queries.
* `connection` (string) - (Optional) The connection name you wants to use. Standard name is `default`.
* `callback` (function) - Callback function with parameters 'error' and 'array list'.

<strong>Example</strong>

```javascript
var db = require('Neo4JQuery').singleton()
  , db.connect({...});
  , query = "MATCH (n:Node {field1: {v1}})-[r1:IS_LABEL]-(n2:Node2 {field2: {v2}}) RETURN n"
  , parameters = {v1: "value1", v2: "value2"}

  db.query(query, parameters, 'readServer', function(err, list) {
    if (err || void 0 === list) {
      callback(err, void 0);
    } else {
      // some stuff here with list
      var user = list[0];
    }
  });
```

<a name="call"></a>
<h4>Call(domain[, procedureName], callback)</h4>

Calls a stored procedure in the graph database (available at v3.0 of Neo4J).
It is also possible to pass-in the two parts of the procedure name only in domain like `domain = 'com.example.test.lib.hasRelation()'`.

<strong>Arguments</strong>

* `domain` (string) - The domain part of the stored procedure like 'com.example.test.lib'.
* `procedureName` (string) - The name of the procedure as function call ('hasRelation()').
* `callback` (function) - Callback function with parameters 'error' and result as array list.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , domain = "com.example.test.lib"
  , procedureName = "hasRelation()";

  db.Call(domain, procedureName, function(err, list) {
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
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , completeProcedureName = "com.example.test.lib.hasRelation()";

  db.Call(completeProcedureName, function(err, list) {
      if (err || void 0 === list) {
        callback(err, void 0);
      } else {
        // some stuff here with list
        var user = list[0];
      }
    });
```

<a name="builder"></a>
<h4>Builder</h4>

The Cypher builder object.

<strong>Arguments</strong>

* No arguments

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , builder = db.Builder;

  ...
  ...
```
<a name="begintransaction"></a>
<h4>beginTransaction(connection)</h4>

Starts a transaction. Only available when using the `Bolt` driver!

<strong>Arguments</strong>

* connection (string) - The connection name.

<strong>Example</strong>


<a name="commit"></a>
<h4>commit(callback)</h4>

Finish the transaction and executes the callback function. On `commit` the connection to the server is automatically closed.

<strong>Arguments</strong>

* callback (function) - The callback function called after successful transaction commit.

<strong>Example</strong>


<a name="execute"></a>
<h4>execute(options)</h4>

Executes the query and returns result set.

<strong>Arguments</strong>

* `options` (Object) - An config object with needed settings.
- `builder` (Builder) - The Cypher query builder you created the query with.
- `cached` (boolean) - Flag set to false for default. Set to true Neo4JQuery will use the last cached query for execution.
- `labelMap` (Object) - Set a map of expected result placeholder to replace them.
- `connection` (String) - Name of connection to be used.
- `success` (function) - Callback function used if query was successful.
- `error` (function) - Callback function used if query was unsuccessful.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = db.Builder();

    builder
      .reset()
      .Match('u', 'User', {username: "testuser", password: "testpass"});

    db.execute({
      builder: builder,
      cached: false,
      connection: 'readOnlyServer',
      labelMap: {
        u: 'user'
      },
      success: function(results) {
        /**
         * results is here [{user: {username:..., password:..., fieldN:...}}]
         */
      },
      error: function(err) {...}
    });
```

<h3>Cypher Builder</h3>

<a name="reset"></a>
<h4>reset()</h4>

Resets the builder object (inclusive cached query). Should be used to be as first method in the chain when you use the builder object.

<strong>Arguments</strong>

* No arguments

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder.reset();
```

<a name="match"></a>
<h4>Match(placeholder, label, optional, parameters)</h4>
Matches data specified through labels and parameters and bound to the placeholder.

<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node or relationship.
* `label` (string) - The labels which are assigned to nodes.
* `optional` (boolean) - Flag to use 'OPTIONAL MATCH'. Default is `false`.
* `parameters` (object) - Parameters to filter nodes.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('n', 'node', false, {field1: '...', field2: '...'});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      n: 'node'
    },
    success: function(results) {
      /**
       * results is here [{node: {field1:..., field2:..., fieldN:...}}]
       */
     },
    error: function(err) {...}
  });
```

<a name="optionalmatch"></a>
<h4>OptionalMatch(placeholder, label, parameters)</h4>

Matches data specified through labels and parameters and bound to the placeholder.
If there is no information found the placeholder will be null.

<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node or relationship.
* `label` (string) - The labels which are assigned to nodes.
* `optional` (boolean) - Flag to use 'OPTIONAL MATCH'. Default is `false`.
* `parameters` (object) - Parameters to filter nodes.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .OptionalMatch('n', 'node', {field1: '...', field2: '...'});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      n: 'node'
    },
    success: function(results) {
      /**
       * "results" is here [{node: {field1:..., field2:..., fieldN:...}}]
       * If there was no match the result is an empty array.
       */
     },
    error: function(err) {...}
  });
```

<a name="merge"></a>
<h4>Merge(placeholder, label, parameters)</h4>
Try to create and insert new node with given parameters and label.

<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node.
* `label` (string) - The labels which are assigned to the node.
* `parameters` (object) - Parameters of the node.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: '...', field2: '...', createdAt: 120987654321});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {
      /**
       * "results" is here [{user: {field1:..., field2:..., createdAt: 120987654321}}]
       */
    },
    error: function(err) {...}
  });
```

<a name="mergerelationship"></a>
<h4>MergeRelationShip(nodes, placeholder, label, parameters)</h4>

Try connect two nodes with a relationship with given information.


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.
* `placeholder` (string) - The placeholder of the relationship.
* `label` (string) - The labels which are assigned to the relationship.
* `parameters` (object) - Parameters of the relationship.

<strong>Example</strong>

```javascript
// Here the first value in the nodes array points to the second value 
// via relationship 'ASSIGNED_WITH_EACH_OTHER'!
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', false, {field1: ..., field2: ...})
    .With(['u'])
    .Merge('n', 'Node', false, {field3: '...', field4: '...', createdAt: 120987654321})
    .With(['u', 'n'])
    .MergeRelationShip(['n', 'u'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field5: '...', field6: '...'});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node',
      r: 'relation'
    },
    success: function(results) {
      /**
       * "results" is here:
          [
            {user: {field1:..., field2:..., createdAt: 120987654321}},
            {node: {field3: '...', field4: '...', createdAt: 120987654321}},
            {relation: {field5: '...', field6: '...'}}
          ]
       */
    },
    error: function(err) {...}
  });
```

<a name="oncreate"></a>
<h4>onCreate(command)</h4>
Event used with _Merge_ to be executed if _Merge_ creates a new node/relationship.


<strong>Arguments</strong>

* `command` (string) - The command like _SET_ followed by what to do.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: ..., field2: ...})
    .relate('r1', 'GUESSED_RELATIONSHIP')
    .toNode('n', 'Note', {field3: ..., field4: ...})
    .onCreate('SET u.createdAt=timestamp(), n.createdAt=timestamp()');

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {field1:..., field2:..., createdAt: 120987654321}},
       *   {node: {field3: '...', field4: '...', createdAt: 120987654321}}
       * ]
       */
    },
    error: function(err) {...}
  });
```

<a name="onmatch"></a>
<h4>onMatch(command)</h4>
Event used with _Merge_ to be executed if _Merge_ matches a node.


<strong>Arguments</strong>

* `command` (string) - The command like _SET_ followed by what to do.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Merge('u', 'User', {field1: ..., field2: ...})
    .relate('r1', 'GUESSED_RELATIONSHIP')
    .toNode('n', 'Note', {field3: ..., field4: ...})
    .onMatch('SET u.visited=timestamp(), n.visited=timestamp()');

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      n: 'node'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {field1:..., field2:..., createdAt: 120987654321}},
       *   {node: {field3: '...', field4: '...', createdAt: 120987654321}}
       * ]
       */
    },
    error: function(err) {...}
  });
```

<a name="delete"></a>
<h4>Delete(placeholder)</h4>
Deletes all the given nodes/relationships.
Please take care of the order of relationships and nodes you want to remove.

<strong>Arguments</strong>

* `placeholder` (string|array) - The placeholder of node/nodes to be deleted.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', {...})
    .relate('r1', 'RELATIONSHIP', {...})
    .toNode('u2', 'User', {...})
    .Delete(['r1', 'u', 'u2']);

  db.execute({
    builder: builder,
    success: function(results) {
      /**
       * "results" is here:
       * []
       */
    },
    error: function(err) {...}
  });
```

<a name="with"></a>
<h4>With(placeholders)</h4>
Sets a driver which is connected to a Neo4j database. The only requirement is that the driver implements a method called 'query'.

<strong>Arguments</strong>

* `placeholders` (array) - An array with all placeholders which have to be connected with next cypher command.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User', {username: 'Neo4JQueryuser', password: 'password'})
    .With(['u'])
    .Match('u2', 'User', {username: 'Neo4JQueryuser2', password: 'password'})
    .MergeRelationShip(['u', 'u2'], 'r', 'ASSIGNED_WITH_EACH_OTHER', {field1: '...', field2: '...'});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user',
      u2: 'user2',
      r: 'relation'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {username: 'Neo4JQueryuser', password: 'password', fieldN: ...}},
       *   {user2: {username: 'Neo4JQueryuser2', password: 'password', fieldN: ...}},
       *   {r: {field1: '...', field2: '...'}}
       * ]
       */
    },
    error: function(err) {...}
  });
```

<a name="where"></a>
<h4>Where(placeholder, parameter)</h4>

Sets conditions to find specific nodes or relationships.

<strong>Arguments</strong>

* `string` (string) - The conditions to filter nodes and/or relationships.
* `parameter` (object) - The parameters for prepared cypher statements provided by the NodeJS driver.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.username={username} and u.password={password}", {username: 'testuser', password: 'password'});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {username: 'Neo4JQueryuser', password: 'password', fieldN: ...}}
       * ]
       */
    },
    error: function(err) {...}
  });
```

<a name="set"></a>
<h4>Set(placeholder, parameter)</h4>

Sets given properties to a node or relationship.

<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node or relationship.
* `parameter` (object) - All parameters to be set as properties in the node or relationship.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.username={username} and u.password={password}", {username: 'Neo4JQueryuser', password: 'password'})
    .Set('u', {createdAt: 1440360134452, updatedAt: 1440360134452});

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {username: 'Neo4JQueryuser', password: 'password', createdAt: 1440360134452, updatedAt: 1440360134452, fieldN: ...}}
       * ]
       */
    },
    error: function(err) {...}
  });
```

<a name="wherein"></a>
<h4>WhereIn(values)</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="orderby"></a>
<h4>OrderBy(orders)</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="skip"></a>
<h4>Skip(number)</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="limit"></a>
<h4>Limit(limit)</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="remove"></a>
<h4>Remove</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="foreacharray"></a>
<h4>ForeachArray(list, query)</h4>


<strong>Arguments</strong>

* `nodes` (array) - The placeholder of the nodes which has to be connected with each other.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="foreachcondition"></a>
<h4>ForeachCondition(condition, query)</h4>

Adds a cypher foreach loop to the query to update the nodes in a list.

<strong>Arguments</strong>

* `condition` (string) - The condition to iterate over a list of nodes.
* `query` (string) - The update command.

<strong>Example</strong>

```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();

  builder
    .reset()
    .Match('u', 'User')
    .Where("u.updatedAt > {timestamp}", {timestamp: new Date().getTime() - 3600})
    .ForeachCondition('user IN u', 'SET user.visited=true');

  db.execute({
    builder: builder,
    cached: false,
    aliases: {
      u: 'user'
    },
    success: function(results) {
      /**
       * "results" is here:
       * [
       *   {user: {username: 'Neo4JQueryuser', password: 'password', createdAt: 1440360134452, updatedAt: 1440360134452, visited: true, fieldN: ...}},
       *   {user: {username: 'testuser', password: 'password2', createdAt: 1440360334112, updatedAt: 1440360334112, visited: true, fieldN: ...}},
       * ]
       */
    },
    error: function(err) {...}
  });
```


<a name="getnodequery"></a>
<h4>getNodeQuery(placeholder, label, parameter, action)</h4>


<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node.
* `label` (string) - The label of the node.
* `parameter` (object) - A list of values for parmeterized Cypher query.
* `action` (number) - The action that has to be executed like "MATCH" or "MERGE".

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```



<a name="batchcreate"></a>
<h4>BatchCreate(placeholderPrefixes, labels, parameters)</h4>

Creates new nodes in one query via comma seperated list of nodes. The placeholders are the leading list. If one of the other lists (labels and parameters) come to the end before placeholders list the last of there values are taken for the rest of the placeholders list.

<strong>Arguments</strong>

* `placeholderPrefixes` (array) - A list of placeholders the new nodes should have on return.
* `labels` (array) - A list of labels of the new nodes.
* `parameters` (array) - The list of parameter objects with the values for the single node.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="tonode"></a>
<h4>toNode(placeholder, label, parameter)</h4>


<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node which is connected via relationship.
* `label` (string) - The label of the relationship.
* `parameter` (object) - The list of values for a parameterized Cypher query.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="relate"></a>
<h4>relate(relationPlaceholder, label, parameter)</h4>


<strong>Arguments</strong>

* `relationPlaceholder` (string) - The placeholder of the relationship itself.
* `label` (string) - The label of the relationship.
* `parameter` (object) - The list of values for a parameterized Cypher query.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="related"></a>
<h4>Related(placeholders, relationPlaceholders, label, parameter)</h4>


<strong>Arguments</strong>

* `placeholders` (array) - The 2 placeholders which are connected in the Cypher query.
* `relationPlaceholders` (string) - The placeholder of the relationship itself.
* `label` (string) - The label of the relationship.
* `parameter` (object) - The list of values for a parameterized Cypher query.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="start"></a>
<h4>Start(placeholder, label, parameter)</h4>


<strong>Arguments</strong>

* `placeholder` (string) - The placeholder of the node which has to be started with.
* `label` (string) - The label of the starting node.
* `parameter` (Object) - The list of values for a parameterized Cypher query.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="getquery"></a>
<h4>getQuery(labelMap)</h4>


<strong>Arguments</strong>

* `labelMap` (Object) - A map to replace expected result placeholder names.

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="getparameters"></a>
<h4>getParameters()</h4>


<strong>Arguments</strong>


--

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```


<a name="hasqueries"></a>
<h4>hasQueries</h4>


<strong>Arguments</strong>

--

<strong>Example</strong>
```javascript
var db = require("Neo4JQuery").singleton()
  , db.connect({...})
  , builder = graph.Builder();
```
