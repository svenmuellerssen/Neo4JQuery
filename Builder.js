var _ = require('underscore');


var Builder = function() {
  var queries = []
    , QueryPlaceholders = []
    , uniqueIds = []
    , parameters = {};

  /**
   *
   * @returns {string}
   */
  this.getQuery = function(placeholders) {
    var me = this
      , query = "";

    if (me.hasQueries()) {
      // Concat all queries.
      query = queries.join('\n');

      // Get the placeholders for return them.
      if (Array.isArray(placeholders) && placeholders.length > 0) {
        // Return placeholders.
        query = query + ' RETURN ' + placeholders.join(', ');
      } else {
        query += query + ' RETURN * ';
      }
    }


    return query;
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
   * @param parameter
   * @returns {Graph}
   */
  this.Match = function(placeholder, label, parameter) {
    placeholder = placeholder || null;
    parameter = parameter || {};


    if (_.isNull(placeholder)) {
      placeholder = 't';
    }

    var me = this
      , query = 'MATCH (' + placeholder + ':' + label;

    if (parameter && !_.isEmpty(parameter)) {
      query += ' ' + me.prepareParameter(':', parameter) + ') ';
    } else {
      query += ') ';
    }

    queries.push(query);
    QueryPlaceholders.push(placeholder);
    return this;
  };


  /**
   *
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Graph}
   */
  this.Merge = function(placeholder, label, parameter) {
    placeholder = placeholder || null;
    parameter = parameter || {};
    label = label || '';

    if (label !== '') {
      label = ':'.concat(label);
    }

    if (_.isNull(placeholder)) {
      placeholder = 't';
    }

    var me = this
      , query = 'MERGE (' + placeholder + label;

    if (parameter && !_.isEmpty(parameter)) {
      query += ' ' + me.prepareParameter(':', parameter) + ') ';
    } else {
      query += ') ';
    }

    queries.push(query);
    QueryPlaceholders.push(placeholder);

    return this;
  };

  /**
   *
   * @param nodes
   * @param placeholder
   * @param label
   * @param parameter
   * @returns {Graph}
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

      var string = 'MERGE (' + nodes[0] + ')-' + '[' + placeholder;
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
   * @param condUpdate
   * @returns {Graph}
   */
  this.onCreate = function(condUpdate) {
    condUpdate = condUpdate || null;
    var string = '';

    if (!_.isNull(condUpdate))
      string = 'ON CREATE ' + condUpdate;

    if (string !== '')
      queries.push(string);

    return this;
  };

  /**
   *
   * @param condUpdate
   * @returns {Graph}
   */
  this.onMatch = function(condUpdate) {
    condUpdate = condUpdate || null;
    var string = '';

    if (!_.isNull(condUpdate))
      string = 'ON MATCH ' + condUpdate;

    if (string !== '')
      queries.push(string);

    return this;
  };

  /**
   *
   * @param placeholder
   * @returns {Graph}
   * @constructor
   */
  this.Delete = function(placeholder) {
    placeholder = placeholder || null;

    if (!_.isNull(placeholder)) {
      var string = '';
      if (typeof placeholder === 'string') {
        string += 'DELETE ' + placeholder;
      } else if (Array.isArray(placeholder) && placeholder.length > 0) {
        string += 'DELETE ' + placeholder.join(', ');
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
   * @returns {Graph}
   */
  this.With = function(placeholders) {
    if (Array.isArray(placeholders) && placeholders.length !== 0) {
      var string = 'WITH ' + placeholders.join(', ');
      queries.push(string);
    }

    return this;
  };

  /**
   *
   * @param placeholder
   * @param parameter
   * @returns {Graph}
   * @constructor
   */
  this.Set = function(placeholder, parameter) {
    if (placeholder && placeholder !== '') {
      var me = this
        , string = 'SET ' + me.prepareParameter(placeholder + '.', parameter);

      queries.push(string);
    }

    return this;
  };

  /**
   *
   * @param string
   * @param parameter
   * @returns {Graph}
   * @constructor
   */
  this.Where = function(string, parameter) {
    string = string || null;
    parameter = parameter || null;

    if (!_.isNull(string) && typeof string === 'string')
      queries.push('WHERE ' + string);

    if (!_.isNull(parameter))
      parameters = _.extend(parameters, parameter);

    return this;
  };

  /**
   *
   * @param list
   * @param query
   * @returns {Graph}
   * @constructor
   */
  this.ForeachArray = function(list, query) {
    list = list || null;
    query = query || null;

    if (!_.isNull(query) && Array.isArray(list) && list.length > 0) {
      var string = 'FOREACH (item in {items} | \n' + query + ')';
      queries.push(string);
      parameters = {items: list};
    }

    return this;
  };

  /**
   *
   * @param condition
   * @param query
   * @returns {Graph}
   * @constructor
   */
  this.ForeachCondition = function(condition, query) {
    condition = condition || null;
    query = query || null;

    if (!_.isNull(query) && typeof condition === 'string') {
      var string = 'FOREACH (' + condition + ' | \n' + query + ')';
      queries.push(string);
    }

    return this;
  };

  /**
   *
   * @param idName
   * @param additionalPlaceholders
   * @returns {Graph}
   */
  this.createUniqueId = function(idName, additionalPlaceholders) {
    if (!Array.isArray(additionalPlaceholders) || additionalPlaceholders.length == 0)
      additionalPlaceholders = [idName];
    else
      additionalPlaceholders.unshift(idName);

    queries.push("MERGE (id:UniqueId{}) ON CREATE SET id.count = 41 ON MATCH SET id.count = id.count + 1 WITH id.count AS " + additionalPlaceholders.join(', ') + " ");
    uniqueIds.push(idName);
    return this;
  };


  /**
   *
   * @param obj
   * @param callback
   */
  this.delete = function(obj, callback) {
    connection.delete(obj, callback);
  };

  /**
   *
   * @returns {Graph}
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
  }

};