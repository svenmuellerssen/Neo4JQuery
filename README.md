# Neo4jQuery
Tool that handles cypher syntax as method calls

# What is Neo4jQuery?
Neo4jQuery is a simple implementation based on the cypher query language used in the graph database system Neo4J. 

#Why Neo4jQuery
I implemented this wrapper class for the Neo4J query language because seraph can not perform a delete of a node and/or relationship in NodeJS with cypher. 

# How to use
1. Download repository into a library folder (later it should be a npm module).
2. Install the module `underscore` via __npm install underscore__.
3. Install the module `seraph` via __npm install seraph__.
4. Import both, seraph and Neo4jQuery, with 'require' and connect to your Neo4J graph database 

__Quick example__
```javascript
var seraph = require("seraph")({
	"http://localhost:7474",
  	user: configurationParams.app.db.user,
  	pass: configurationParams.app.db.pass
    })
    , db = require(<path to Neo4jQuery>)(seraph);
    ...
    ...
```

#Documentation
<a name="match" />
### Match(placeholder, label, parameters)
Matches data specified through labels and parameters and bound to the placeholder.

__Arguments__

* `placeholder` (string)- The placeholder of the node or relationship.
* `label` (string)- The labels which are assigned to nodes.
* `parameters` (object) - Parameters to filter nodes.

__Example__

```javascript
var db = require(<path to Neo4jQuery>)
    db
      .reset()
      .Match('n', 'User', {username: 'neo4jqueryuser', password: 'password'})
      .run(['n'], function(err, list) {
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
var db = require(<path to Neo4jQuery>)
    db
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

