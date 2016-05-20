var _instance = null
  , _ = require('underscore');

/**
 * @todo Implement options objects as method signature to pass in parameter into builder methods.
 */
var Builder = function() {
  var queries = []
    , QueryPlaceholders = []
    , uniqueIds = []
    , parameters = {};

  this.MATCH = 1;
  this.OPTIONAL_MATCH = 2;
  this.START = 3;
  this.CREATE = 4;
  this.CREATE_UNIQUE = 5;
  this.DELETE = 6;
  this.MERGE =7;
  
  this.AGGREGATE_SUM=1;
  this.AGGREGATE_COUNT=2;
  this.AGGREGATE_AVG=3;
  this.AGGREGATE_MIN=4;
  this.AGGREGATE_MAX=5;
  this.AGGREGATE_COLLECT=6;
  this.AGGREGATE_FILTER=7;
  this.AGGREGATE_EXTRACT=8;
  
  /**
   *
   * @returns {string}
   * @todo Implement 'returned' with aliases!!
   */
  this.getQuery = function(returned) {
    returned = (returned && !_.isEmpty(returned)) ? _.keys(returned) : [];

    var me = this
      , query = "";

    if (me.hasQueries()) {
      // Concat all queries.
      query = queries.join('');

      // Get the placeholders for return them...
      if (returned.length == 0 && Array.isArray(QueryPlaceholders) && QueryPlaceholders.length > 0) {
        // Return placeholders.
        query += ' RETURN ' + QueryPlaceholders.join(', ');
      } else {
        // ... or have given placeholder to return.
        returned = _.unique(returned);
        query += ' RETURN ' + returned.join(', ');
      }
    }

    return query;
  };

  /**
   *
   * @returns {object}
   */
  this.getParameters = function() {
    return parameters;
  };

  /**
   *
   * @returns {boolean}
   */
  this.hasQueries = function() {
    return (queries.length > 0);
  };

  /**
   *
   * @param placeholder
   * @param label
   * @param optional
   * @param parameter
   * @returns {Builder}
   */
  this.Match = function(placeholder, label, optional, parameter) {
    if(typeof optional !== 'boolean') {
        parameter = optional;
        optional = false;
    }
    var query = '';

    if (optional === true) {
        query = ' OPTIONAL MATCH ';
    } else {
    	query = ' MATCH ';
	  }

    query += this.getNodeQuery(placeholder, label, parameter);
    queries.push(query);

    QueryPlaceholders.push(placeholder);

    return this;
  };

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   * @constructor
   */
  this.OptionalMatch = function(placeholder, label, parameter) {
    return this.Match(placeholder, label, true, parameter);
  };

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   * @constructor
   */
  this.toNode = function(placeholder, label, parameter) {
    queries.push(this.getNodeQuery(placeholder, label, parameter));
    QueryPlaceholders.push(placeholder);
    return this;
  };

  /**
   *
   * @param placeholders
   * @param relationPlaceholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.Related = function(placeholders, relationPlaceholder, label, parameter) {
    placeholders = (Array.isArray(placeholders) && placeholders.length > 0) ? placeholders : [];
    parameter = parameter || {};
    relationPlaceholder = relationPlaceholder || '';
    label = label || '';

    if (label !== '') {
      label = ':'.concat(label);
    }

    var me = this
      , query = '';

    if (placeholders.length == 0 ) {
        return me;
    } else {
      query = '(' + placeholders[0] + ')-[' + relationPlaceholder + label;

      if (parameter && !_.isEmpty(parameter)) {
        query += ' ' + me.prepareParameter(':', parameter) + ']-'
      } else {
        query += ']-';
      }

      query += '(' + placeholders[1] + ') ';

      queries.push(query);

      return me;
    }
  };

  /**
   *
   * @param relationPlaceholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.relate = function(relationPlaceholder, label, parameter) {
    relationPlaceholder = relationPlaceholder || 'ar';
    label = label || '';

    if (label !== '') {
        label = ':'.concat(label);
    }

    var me = this
      , query = '-['+ relationPlaceholder + label ;

    if (!_.isNull(parameter)) {
      query += ' ' + me.prepareParameter(parameter);
    }

    query += ']-';

    queries.push(query);
    return me;
  };

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.Merge = function(placeholder, label, parameter) {
    if (_.isNull(placeholder)) {
      placeholder = 't';
    }

    var query = ' MERGE ';
    query += this.getNodeQuery(placeholder, label, parameter);

    queries.push(query);
    QueryPlaceholders.push(placeholder);

    return this;
  };

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {string}
   */
  this.getNodeQuery = function(placeholder, label, parameter) {
    placeholder = placeholder || null;
    parameter = parameter || {};
    label = label || '';

    var me = this
      , query = '';

    if (_.isNull(placeholder)) {
      placeholder = 'at';
    }

    if (label !== '') {
      label = ':'.concat(label);
    }

    query += '(' + placeholder + label;

    if (parameter && !_.isEmpty(parameter))
      query += ' ' + me.prepareParameter(':', parameter) + ')';
    else
      query += ')';

    return query;
  };

//  var getRelationQuery = function() {
//
//  };

  /**
   *
   * @param nodes
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.MergeRelationShip = function(nodes, placeholder, label, parameter) {
    nodes = nodes || [];

    if (!parameter && typeof label !== 'string') {
      parameter = label;
      label = placeholder;

    } else {
      placeholder = placeholder || null;
      label = label || '';
      parameter = parameter || {};
    }

    if (nodes.length < 2) {
      return this;
    } else {
      var me = this;

      if (_.isNull(placeholder)) {
        placeholder = 'r'
      }

      var string = ' MERGE (' + nodes[0] + ')-' + '[' + placeholder;
      if (label !== '') {
        string += ':' + label + ' ';
      }

      string += me.prepareParameter(':', parameter) + ']-(' + nodes[1] + ') ';

      queries.push(string);
      QueryPlaceholders.push(placeholder);

      return this;
    }
  };

  /**
   *
   * @param command
   * @returns {Builder}
   */
  this.onCreate = function(command) {
    command = command || null;
    var string = '';

    if (!_.isNull(command))
      string = ' ON CREATE ' + command;

    if (string !== '')
      queries.push(string);

    return this;
  };

  /**
   *
   * @param command
   * @returns {Builder}
   */
  this.onMatch = function(command) {
    command = command || null;
    var string = '';

    if (!_.isNull(command))
      string = ' ON MATCH ' + command;

    if (string !== '')
      queries.push(string);

    return this;
  };

  /**
   *
   * @param placeholder
   * @returns {Builder}
   */
  this.Delete = function(placeholder) {
    placeholder = placeholder || null;

    if (!_.isNull(placeholder)) {
      var string = '';
      if (typeof placeholder === 'string') {
        string += ' DELETE ' + placeholder;
      } else if (Array.isArray(placeholder) && placeholder.length > 0) {
        string += ' DELETE ' + placeholder.join(', ');
      }

      if (string !== '') {
        queries.push(string);
      }
    }

    return this;
  };

  /**
   *
   * @param placeholders
   * @returns {Builder}
   */
  this.With = function(placeholders) {
    if (Array.isArray(placeholders) && placeholders.length !== 0) {
      var string = ' WITH ' + placeholders.join(', ');
      queries.push(string);
    }

    return this;
  };

  /**
   *
   * @param string
   * @param parameter
   * @returns {Builder}
   */
  this.Where = function(string, parameter) {
    string = string || null;
    parameter = parameter || null;

    if (!_.isNull(string) && typeof string === 'string')
      queries.push(' WHERE ' + string);

    if (!_.isNull(parameter))
      parameters = _.extend(parameters, parameter);

    return this;
  };

  /**
   *
   * @param placeholder
   * @param parameter
   * @returns {Builder}
   */
  this.Set = function(placeholder, parameter) {
    if (placeholder && placeholder !== '') {
      var me = this
        , string = ' SET ' + me.prepareParameter(placeholder + '.', parameter);

      queries.push(string);
    }

    return this;
  };

  /**
   *
   * @param list
   * @param query
   * @returns {Builder}
   */
//  this.ForeachArray = function(list, query) {
//    list = list || null;
//    query = query || null;
//
//    if (!_.isNull(query) && Array.isArray(list) && list.length > 0) {
//      var string = ' FOREACH (item in {items} | \n' + query + ')';
//      queries.push(string);
//      parameters = {items: list};
//    }
//
//    return this;
//  };

  /**
   *
   * @param condition
   * @param query
   * @returns {Builder}
   */
  this.ForeachCondition = function(condition, query) {
    condition = condition || null;
    query = query || null;

    if (!_.isNull(query) && typeof condition === 'string') {
      var string = ' FOREACH (' + condition + ' | \n' + query + ')';
      queries.push(string);
    }

    return this;
  };

    /**
     *
     * @param placeholder
     * @param reader
     * @param aggregateFunc
     * @returns {Builder}
     * @constructor
     */
//  this.AggregateReadOnly = function(placeholder, reader, aggregateFunc) {
//    if (typeof placeholder === 'string') {
//      placeholder = [placeholder];
//    }
//
//    // check here the reader parameter..
//    if (!isReader(reader) || !isAggregateFunc(aggregateFunc)) {
//      return this;
//    } else {
//        // todo Check if the placeholder exists in global array because they have to be replaced by the aggregated ones.
//      var queryPart = '';
//      switch(reader) {
//        case this.MATCH:
//            queryPart = ' MATCH ' + placeholder.map(function(val){
//                "use strict";
//                return glueForAggregation(this.MATCH, val) + ', ';
//            });
//          break;
//        case this.OPTIONAL_MATCH:
//            queryPart = ' MATCH OPTIONAL' + placeholder.map(function(val){
//                "use strict";
//                return glueForAggregation(this.OPTIONAL_MATCH, val) + ', ';
//            });
//          break;
//        case this.START:
//            queryPart = ' START ' + placeholder.map(function(val){
//                "use strict";
//                return glueForAggregation(this.START, val) + ', ';
//            });
//        break;
//      }
//
//        queryPart = queryPart.substr(0, -2);
//        queries.push(queryPart);
//      return this;
//    }
//  };

  /**
   *
   * @param placeholder
   * @param readWriter
   * @param aggregateFunc
   * @returns {Builder}
   * @constructor
   */
//  this.AggregateReadWrite = function(placeholder, readWriter, aggregateFunc) {
//      if (typeof placeholder === 'string') {
//          placeholder = [placeholder];
//      }
//      // check here the reader parameter..
//      if (!isReadWriter(reader) || !isAggregateFunc(aggregateFunc)) {
//          return this;
//      } else {
//        // todo Check if the placeholder exists in global array because they have to be replaced by the aggregated ones.
//        var queryPart = '';
//          switch(readWriter) {
//              case this.CREATE:
//                  queryPart = ' CREATE ' + placeholder.map(function(val){
//                          "use strict";
//                          return glueForAggregation(this.CREATE, val) + ', ';
//                      });
//                  break;
//              case this.CREATE_UNIQUE:
//                  queryPart = ' CREATE UNIQUE ' + placeholder.map(function(val){
//                          "use strict";
//                          return glueForAggregation(this.CREATE_UNIQUE, val) + ', ';
//                      });
//                  break;
//              case this.MERGE:
//                  queryPart = ' MERGE ' + placeholder.map(function(val){
//                          "use strict";
//                          return glueForAggregation(this.MERGE, val) + ', ';
//                      });
//                  break;
//              case this.DELETE:
//                  queryPart = ' DELETE ' + placeholder.map(function(val){
//                          "use strict";
//                          return glueForAggregation(this.DELETE, val) + ', ';
//                      });
//                  break;
//              default:
//                  break;
//          }
//      }
//    return this;
//  };

  /**
   *
   * @param placeholder
   * @param aggregateFunc
   * @returns {Builder}
   * @constructor
   */
//  this.AggregateReturn = function(placeholder, aggregateFunc) {
//      if (typeof placeholder === 'string') {
//          placeholder = [placeholder];
//      }
//      // check here the reader parameter..
//      if (!isAggregateFunc(aggregateFunc)) {
//          return this;
//      } else {
//          placeholder.forEach(function(placeholder) {
//              "use strict";
//              QueryPlaceholders.push(glueForAggregation(aggregateFunc, placeholder));
//          });
//      }
//
//    return this;
//  };

  /**
   *
   * @param idName
   * @param additionalPlaceholders
   * @returns {Builder}
   */
//  this.createUniqueId = function(idName, additionalPlaceholders) {
//    if (!Array.isArray(additionalPlaceholders) || additionalPlaceholders.length == 0)
//      additionalPlaceholders = [idName];
//    else
//      additionalPlaceholders.unshift(idName);
//
//    queries.push(" MERGE (id:UniqueId{}) ON CREATE SET id.count = 1 ON MATCH SET id.count = id.count + 1 WITH id.count AS " + additionalPlaceholders.join(', ') + " ");
//    uniqueIds.push(idName);
//    return this;
//  };

  /**
   *
   * @returns {Builder}
   */
  this.reset = function() {
    QueryPlaceholders = [];
    queries = [];
    uniqueIds.length = 0;

    return this;
  };

  /**
   *
   * @param separator
   * @param parameter
   * @returns {string}
   */
  this.prepareParameter = function(separator, parameter) {
    if (!separator) {
      parameter = separator;
      separator = ':';
    }

    var string = ''
      , keys = _.keys(parameter);

    if (separator === ':') {
      string = '{';
    }

    keys.forEach(function(key) {
      if (separator === ':') {
        // Parameter format for node creation
        if (isNaN(parameter[key])) {
          if (uniqueIds.indexOf(parameter[key]) != -1) {
            string += key + separator + ' ' + parameter[key] + ', ';
          } else {
            string += key + separator + ' "' + parameter[key] + '", ';
          }
        } else if (!isNaN(parameter[key]) && typeof parseFloat(parameter[key]) === 'number') {
          string += key + separator + ' ' + parameter[key] + ', ';
        }
      } else if (separator.indexOf('.') != -1) {

        if (isNaN(parameter[key])) {
          if (uniqueIds.indexOf(parameter[key]) != -1) {
            string += separator + key + '=' + parameter[key] + ', ';
          } else {
            string += separator + key + '="' + parameter[key] + '", ';
          }
        } else if (!isNaN(parameter[key]) && typeof parseFloat(parameter[key]) === 'number') {
          string += separator + key + '=' + parameter[key] + ', ';
        }
      }

    });

    if (string !== '{')
      string = string.substr(0, string.length - 2);

    if (separator === ':') string += '}';

    return string;
  };

    /**
     *
     * @param reader
     * @returns {boolean}
     */
//  var isReader = function(reader) {
//      reader = reader || 0;
//      if (typeof parseInt(reader) !== 'number')
//        return false;
//
//      switch(reader) {
//          case this.MATCH:
//          case this.OPTIONAL_MATCH:
//          case this.START:
//            return true;
//          break;
//          default:
//            return false;
//          break;
//      }
//  };

    /**
     *
     * @param readWriter
     * @returns {boolean}
     */
//  var isReadWriter = function(readWriter) {
//    readWriter = readWriter || 0;
//    if (typeof parseInt(readWriter) !== 'number') {
//      return false;
//    }
//
//    var me = this;
//    switch(readWriter) {
//      case me.CREATE:
//      case me.MERGE:
//      case me.CREATE_UNIQUE:
//      case me.DELETE:
//        return true;
//        break;
//      default:
//        return false;
//    }
//  };

    /**
     *
     * @param func
     * @returns {boolean}
     */
//  var isAggregateFunc = function (func) {
//    if (isNAN(parseInt(func)))
//      return false;
//
//    var me = this;
//    switch(func) {
//      case me.AGGREGATE_COUNT:
//      case me.AGGREGATE_SUM:
//      case me.AGGREGATE_AVG:
//      case me.AGGREGATE_MIN:
//      case me.AGGREGATE_MAX:
//      case me.AGGREGATE_COLLECT:
//      case me.AGGREGATE_FILTER:
//      case me.AGGREGATE_EXTRACT:
//        return true;
//      default:
//        return false;
//    }
//  };

  /**
   *
   * @param func
   * @param placeholder
   * @returns {string}
   */
//  var glueForAggregation = function(func, placeholder) {
//        "use strict";
//    var me = this;
//      if (isAggregateFunc(func)) {
//        switch(func) {
//          case me.AGGREGATE_COUNT:
//            return 'count(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_SUM:
//            return 'sum(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_AVG:
//            return 'avg(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_MIN:
//            return 'min(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_MAX:
//            return 'max(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_COLLECT:
//            return 'collect(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_FILTER:
//            return 'filter(' + placeholder + ')';
//            break;
//          case me.AGGREGATE_EXTRACT:
//            return 'extract(' + placeholder + ')';
//            break;
//          default:
//            break;
//        }
//      }
//    }
  };

/**
 *
 * @returns {Builder}
 */
Builder.singleton = function() {
  if (_.isNull(_instance) === true) {
    _instance = new Builder();
  }

  return _instance;
};

module.exports = Builder;