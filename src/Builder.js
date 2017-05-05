'use strict'

var _instance = null,
  _ = require('underscore')

/**
 * @todo Implement options objects as method signature to pass in parameter into builder methods.
 */
var Builder = function () {
  'use strict'

  var queries = [],
    QueryPlaceholders = [],
    uniqueIds = [],
    parameters = {}

  this.MATCH = 1
  this.OPTIONAL_MATCH = 2
  this.START = 3
  this.CREATE = 4
  this.CREATE_UNIQUE = 5
  this.DELETE = 6
  this.MERGE = 7

  this.AGGREGATE_SUM = 1
  this.AGGREGATE_COUNT = 2
  this.AGGREGATE_AVG = 3
  this.AGGREGATE_MIN = 4
  this.AGGREGATE_MAX = 5
  this.AGGREGATE_COLLECT = 6
  this.AGGREGATE_FILTER = 7
  this.AGGREGATE_EXTRACT = 8

  /**
   *
   * @returns {string}
   * @todo Implement 'returned' with aliases!!
   */
  this.getQuery = function (aliases) {
    'use strict'

    aliases = (aliases && !_.isEmpty(aliases)) ? _.keys(aliases) : []

    var me = this,
      query = ''

    if (me.hasQueries()) {
      // Concat all queries.
      query = queries.join('')
    }

    return query
  }

  /**
   *
   * @returns {object}
   */
  this.getParameters = function () {
    'use strict'

    return parameters
  }

  /**
   *
   * @returns {boolean}
   */
  this.hasQueries = function () {
    'use strict'

    return (queries.length > 0)
  }

  /**
   *
   * @param placeholder
   * @param label
   * @param optional
   * @param parameter
   * @returns {Builder}
   */
  this.Match = function (placeholder, label, optional, parameter) {
    'use strict'

    if (typeof optional !== 'boolean') {
      parameter = optional
      optional = false
    }
    var query = ''

    if (optional === true) {
      query = ' OPTIONAL MATCH '
    } else {
      query = ' MATCH '
    }

    query += this.getNodeQuery(placeholder, label, parameter)
    queries.push(query)

    QueryPlaceholders.push(placeholder)

    return this
  }

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   * @constructor
   */
  this.OptionalMatch = function (placeholder, label, parameter) {
    'use strict'

    return this.Match(placeholder, label, true, parameter)
  }

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   * @constructor
   */
  this.toNode = function (placeholder, label, parameter) {
    'use strict'

    queries.push(this.getNodeQuery(placeholder, label, parameter))
    QueryPlaceholders.push(placeholder)
    return this
  }

  /**
   *
   * @param placeholders
   * @param relationPlaceholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.Related = function (placeholders, relationPlaceholder, label, parameter) {
    'use strict'

    placeholders = (Array.isArray(placeholders) && placeholders.length > 0) ? placeholders : []
    parameter = parameter || {}
    relationPlaceholder = relationPlaceholder || ''
    label = label || ''

    if (label !== '') {
      label = ':'.concat(label)
    }

    var me = this,
      query = ''

    if (placeholders.length == 0) {
      return me
    } else {
      query = '(' + placeholders[0] + ')-[' + relationPlaceholder + label

      if (parameter && !_.isEmpty(parameter)) {
        query += ' ' + me.prepareParameter(':', parameter) + ']-'
      } else {
        query += ']-'
      }

      query += '(' + placeholders[1] + ') '

      queries.push(query)

      return me
    }
  }

  /**
   *
   * @param relationPlaceholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.relate = function (relationPlaceholder, label, parameter) {
    'use strict'

    relationPlaceholder = relationPlaceholder || 'ar'
    label = label || ''

    if (label !== '') {
      label = ':'.concat(label)
    }

    var me = this,
      query = '-[' + relationPlaceholder + label

    if (!_.isNull(parameter)) {
      query += ' ' + me.prepareParameter(parameter)
    }

    query += ']-'

    queries.push(query)
    return me
  }

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Builder}
   */
  this.Merge = function (placeholder, label, parameter) {
    'use strict'

    if (_.isNull(placeholder)) {
      placeholder = 't'
    }

    var query = ' MERGE '
    query += this.getNodeQuery(placeholder, label, parameter)

    queries.push(query)
    QueryPlaceholders.push(placeholder)

    return this
  }

  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {string}
   */
  this.getNodeQuery = function (placeholder, label, parameter) {
    'use strict'

    placeholder = placeholder || null
    parameter = parameter || {}
    label = label || ''

    var me = this,
      query = ''

    if (_.isNull(placeholder)) {
      placeholder = 'at'
    }

    if (label !== '') {
      label = ':'.concat(label)
    }

    query += '(' + placeholder + label

    if (parameter && !_.isEmpty(parameter)) { query += ' ' + me.prepareParameter(':', parameter) + ')' } else { query += ')' }

    return query
  }

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
  this.MergeRelationShip = function (nodes, placeholder, label, parameter) {
    'use strict'

    nodes = nodes || []

    if (!parameter && typeof label !== 'string') {
      parameter = label
      label = placeholder
    } else {
      placeholder = placeholder || null
      label = label || ''
      parameter = parameter || {}
    }

    if (nodes.length < 2) {
      return this
    } else {
      var me = this

      if (_.isNull(placeholder)) {
        placeholder = 'r'
      }

      var string = ' MERGE (' + nodes[0] + ')-' + '[' + placeholder
      if (label !== '') {
        string += ':' + label + ' '
      }

      string += me.prepareParameter(':', parameter) + ']-(' + nodes[1] + ') '

      queries.push(string)
      QueryPlaceholders.push(placeholder)

      return this
    }
  }

  /**
   *
   * @param command
   * @returns {Builder}
   */
  this.onCreate = function (command) {
    'use strict'

    command = command || null
    var string = ''

    if (!_.isNull(command)) { string = ' ON CREATE ' + command }

    if (string !== '') { queries.push(string) }

    return this
  }

  /**
   *
   * @param command
   * @returns {Builder}
   */
  this.onMatch = function (command) {
    'use strict'

    command = command || null
    var string = ''

    if (!_.isNull(command)) { string = ' ON MATCH ' + command }

    if (string !== '') { queries.push(string) }

    return this
  }

  /**
   *
   * @param placeholder
   * @returns {Builder}
   */
  this.Delete = function (placeholder) {
    'use strict'

    placeholder = placeholder || null

    if (!_.isNull(placeholder)) {
      var string = ''
      if (typeof placeholder === 'string') {
        string += ' DELETE ' + placeholder
      } else if (Array.isArray(placeholder) && placeholder.length > 0) {
        string += ' DELETE ' + placeholder.join(', ')
      }

      if (string !== '') {
        queries.push(string)
      }
    }

    return this
  }

  /**
   *
   * @param placeholders
   * @returns {Builder}
   */
  this.With = function (placeholders) {
    'use strict'

    if (Array.isArray(placeholders) && placeholders.length !== 0) {
      var string = ' WITH ' + placeholders.join(', ')
      queries.push(string)
    }

    return this
  }

  /**
   *
   * @param string
   * @param parameter
   * @returns {Builder}
   */
  this.Where = function (string, parameter) {
    'use strict'

    string = string || null
    parameter = parameter || null

    if (!_.isNull(string) && typeof string === 'string') { queries.push(' WHERE ' + string) }

    if (!_.isNull(parameter)) { parameters = _.extend(parameters, parameter) }

    return this
  }

  /**
   *
   * @param placeholder
   * @param parameter
   * @returns {Builder}
   */
  this.Set = function (placeholder, parameter) {
    'use strict'

    if (placeholder && placeholder !== '') {
      var me = this,
        string = ' SET ' + me.prepareParameter(placeholder + '.', parameter)

      queries.push(string)
    }

    return this
  }

  /**
   * Extended work for queryBuilder created by Sven Mueller (svenmue@localdomain.org)
   * github: github.com/svenmuellerssen/Neo4JQuery
   *
   * Added features: REMOVE, SKIP, LIMIT, RETURN, CREATE (single and multiple nodes)
   * Date: 28/04/2017
   * Author: Jesus Bermudez @jesus_bv | github.com/jesusbv | jesusbermudez@quillcontent.com
   */

  this.prepareFields = function (placeholder, parameters) {
    'use strict'

    var string = ''
    let keys = _.keys(parameters)

    keys.forEach(function(key) {
      var separator = (key === 'property' ? '.' : ':')
      string += placeholder + separator + parameters[key] + ','
    })

    string = string.slice(0, -1)

    return string
  }

  /**
   *
   * @param placeholder
   * @param parameter
   * @returns {Builder}
   */
  this.Remove = function (placeholder, parameters) {
    'use strict'

    if (placeholder && placeholder !== '') {
      var me = this,
        string = ' REMOVE ' + me.prepareFields(placeholder, parameters)
      queries.push(string)
    }

    return this
  }

  /**
   *
   * @param expresion Any expression that evaluates to a positive integer 
   * — however the expression cannot refer to nodes or relationships
   * @returns {Builder}
   */
  this.Skip = function (expresion) {
    'use strict'

    var string = ' SKIP ' +  expresion
    queries.push(string)

    return this
  }

  /**
   *
   * @param expresion Any expression that evaluates to a positive integer 
   * — however the expression cannot refer to nodes or relationships
   * @returns {Builder}
   */
  this.Limit = function (expresion) {
    'use strict'

    var string = ' LIMIT ' +  expresion
    queries.push(string)

    return this
  }

  /**
   *
   * @param placeholder
   * @param parameters
   * @param direction [ASC | DESC]
   * @returns {Builder}
   */
  this.Sort = function (placeholder, parameters, direction) {
    'use strict'

    if (placeholder && placeholder !== '') {
      var me = this,
        string = ' ORDER BY '

      if (!direction) {
        direction = ''
      } else {
        direction = ' ' + direction
      }

      parameters.forEach(function (parameter) {
        string += placeholder + '.' + parameter + direction + ','
      })
      string = string.slice(0, -1)

      queries.push(string)
    }

    return this
  }

  this.Return = function (aliases) {
    'use strict'

    var string = ''

    if (!Array.isArray(aliases)) {
      console.error('The aliases for RETURN CLAUSE must be an array')
      throw new Error('The aliases for RETURN CLAUSE must be an array')
    }
    // Get the placeholders for return them...
    if (aliases.length == 0 && Array.isArray(QueryPlaceholders) && QueryPlaceholders.length > 0) {
      // Return placeholders.
      string += ' RETURN ' + QueryPlaceholders.join(', ')
    } else {
      // ... or have given placeholder to return.
      aliases = _.unique(aliases)
      string += ' RETURN ' + aliases.join(', ')
    }

    queries.push(string)

    return this
  }

  /**
   *
   * @param placeholders
   * @param labels Array String representing the labels
   * @param parameters Array of json objects with the properties
   * @returns {Builder}
   */

  this.Create = function (placeholder, labels, parameters) {
    'use strict'

    labels = ':' + labels.join(':') + ' '
    var string = 'WITH ' + parameters + ' AS properties'
    string += 'UNWIND properties AS property'
    string += 'CREATE (' + placeholder + labels + ')'
    string += 'SET ' + placeholder + ' += property'

    queries.push(string)

    return this
  }

  // END NEW=====================================
  // QUILL ======================================

  /**
   *
   * @param list
   * @param query
   * @returns {Builder}
   */
//  this.ForeachArray = function(list, query) {
//    "use strict";
//
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
  this.ForeachCondition = function (condition, query) {
    'use strict'

    condition = condition || null
    query = query || null

    if (!_.isNull(query) && typeof condition === 'string') {
      var string = ' FOREACH (' + condition + ' | \n' + query + ')'
      queries.push(string)
    }

    return this
  }

    /**
     *
     * @param placeholder
     * @param reader
     * @param aggregateFunc
     * @returns {Builder}
     * @constructor
     */
//  this.AggregateReadOnly = function(placeholder, reader, aggregateFunc) {
//    "use strict";
//
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
//    "use strict";
//
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
//    "use strict";
//
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
//    "use strict";
//
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
  this.reset = function () {
    'use strict'

    QueryPlaceholders = []
    queries = []
    uniqueIds.length = 0

    return this
  }

  /**
   *
   * @param separator
   * @param parameter
   * @returns {string}
   */
  this.prepareParameter = function (separator, parameter) {
    'use strict'

    if (!separator) {
      parameter = separator
      separator = ':'
    }

    var string = '',
      keys = _.keys(parameter)

    if (separator === ':') {
      string = '{'
    }

    keys.forEach(function (key) {
      'use strict'

      if (separator === ':') {
        // Parameter format for node creation
        if (isNaN(parameter[key])) {
          if (uniqueIds.indexOf(parameter[key]) != -1) {
            string += key + separator + ' ' + parameter[key] + ', '
          } else {
            // NOTE: clarify this case
            if (parameter[key].slice(-2) === '()') {
              string += key + separator + ' ' + parameter[key] + ', '
            } else {
              // original case
              string += key + separator + ' "' + parameter[key] + '", '
            }
          }
        } else if (!isNaN(parameter[key]) && typeof parseFloat(parameter[key]) === 'number') {
          string += key + separator + ' ' + parameter[key] + ', '
        }
      } else if (separator.indexOf('.') !== -1) {
        if (isNaN(parameter[key])) {
          if (uniqueIds.indexOf(parameter[key]) !== -1) {
            string += separator + key + '=' + parameter[key] + ', '
          } else {
            if (parameter[key].slice(-2) === '()') {
              string += separator + key + '=' + parameter[key] + ', '
            } else {
              string += separator + key + '="' + parameter[key] + '", '
            }
          }
        } else if (!isNaN(parameter[key]) && typeof parseFloat(parameter[key]) === 'number') {
          string += separator + key + '=' + parameter[key] + ', '
        }
      }
    })

    if (string !== '{') { string = string.substr(0, string.length - 2) }

    if (separator === ':') string += '}'

    return string
  }

    /**
     *
     * @param reader
     * @returns {boolean}
     */
//  var isReader = function(reader) {
//    "use strict";
//
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
//    "use strict";
//
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
//    "use strict";
//
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
//    "use strict";
//
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
}

/**
 *
 * @returns {Builder}
 */
Builder.singleton = function () {
  'use strict'

  if (_.isNull(_instance) === true) {
    _instance = new Builder()
  }

  return _instance
}

module.exports = Builder
