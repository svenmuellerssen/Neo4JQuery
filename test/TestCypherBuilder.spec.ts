import {test} from 'ava';
// import { CypherStringFunctionKeyWords } from '../src/lib/Builder/CypherStringFunctionKeyWords';
import { Builder } from '../src/lib/Builder/Builder';
import { CypherOperatorKeyWords } from '../src/lib/Builder/CypherOperatorKeyWords';
import { Bolt, BoltConfig, Rest, RestAPIConfig } from '../src/index';
import { TestConfiguration } from './TestConfiguration';

const configuration: TestConfiguration = new TestConfiguration();
let builder: Builder = Builder.instance();
const boltConfig: BoltConfig = new BoltConfig(configuration.bolt),
    restAPIConfig: RestAPIConfig = new RestAPIConfig(configuration.rest),
    boltDriver: Bolt|null = Bolt.instance(boltConfig),
    restDriver: Rest|null = Rest.instance(restAPIConfig);

test('Test basic functionality like bolt/rest driver', it => {
  it.deepEqual<Builder>(builder, new Builder());
});

test('Test bolt driver', it => {
  it.deepEqual<Bolt>(boltDriver, Bolt.instance(boltConfig));
});

test('Test rest driver', it => {
  it.deepEqual<Rest>(restDriver, Rest.instance(restAPIConfig));
});

test('Test "Match" and "Return" methods', it => {
    builder
      .reset()
      .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
      .Return('n.firstname, n.lastname', false);

    it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nRETURN n.firstname,n.lastname;");
});

test('Test key words "MATCH" AND "WITH" without placeholders piping', it => {
  //     // This query doesn not make any sense and is only to check the "WITH" statement
    builder
      .reset()
      .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
      .With([]);
    it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'});");
});

test('Test key words "MATCH" AND "WITH" with placeholders piping as array', it => {
    builder
      .reset()
      .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
      .With(['n'])
      .Match('u', 'Person', {firstname: 'Angelika', lastname: 'Kohlhaas'}, false)
      .With(['n', 'u']);
  it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nWITH n\nMATCH (u:Person {firstname: 'Angelika',lastname: 'Kohlhaas'})\nWITH n,u;");
});

test('Test key words "MATCH" AND "WITH" with placeholders piping as string', it => {
      builder
        .reset()
        .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
        .With('n')
        .Match('u', 'Person', {firstname: 'Angelika', lastname: 'Kohlhaas'}, false)
        .With('n, u');
  it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nWITH n\nMATCH (u:Person {firstname: 'Angelika',lastname: 'Kohlhaas'})\nWITH n,u;");
});

test('Test key words "MATCH" AND "SET" and placeholders string with one placeholder', it => {
  builder
    .reset()
    .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
    // Here we have set the placeholder as key of parameters.
    .Set('n', {n: {firstname: 'Heinrich', lastname: 'Kohlrabi'}});

  it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nSET n.firstname='Heinrich',n.lastname='Kohlrabi';");

  builder
    .reset()
    .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
    // Here we avoid setting the placeholder as parameters key.
    // This could be used because it is only one placeholder at all.
    // This works also with an array of one placeholder.
    .Set('n', {firstname: 'Heinrich', lastname: 'Kohlrabi'});

    it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nSET n.firstname='Heinrich',n.lastname='Kohlrabi';");
});

test('Test key words "MATCH" AND "SET" and placeholders string with forgotten placeholder', it => {
    builder
      .reset()
      .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
      // Here we have set the placeholder as key of parameters.
      .Set('', {n: {firstname: 'Heinrich', lastname: 'Kohlrabi'}});

  it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'});");
});

test('Test key words "MATCH" AND "SET" and placeholders string with multiple placeholder', it => {
  builder
    .reset()
    .Match('n', 'Person', {firstname: 'Andreas', lastname: 'Kohlhaas'}, false)
    .Set('n, u', {n: {firstname: 'Heinrich', lastname: 'Kohlrabi'}, u: {createdAt: '2017-10.26 12:23:34', updatedAt: '2017-10.26 12:23:34'}});

  it.is<string>(builder.getQuery(), "MATCH (n:Person {firstname: 'Andreas',lastname: 'Kohlhaas'})\nSET n.firstname='Heinrich',n.lastname='Kohlrabi',u.createdAt='2017-10.26 12:23:34',u.updatedAt='2017-10.26 12:23:34';");
});

test('Test key word "Match" and "Where" to build correct single where statement', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where('n.firstname', CypherOperatorKeyWords.CONTAINS, 'drea')
    .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname CONTAINS 'drea'\nRETURN n;");
});

test('Test key word "Match" and "Where" to build correct single where statement and order by identifier property', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where('n.firstname', CypherOperatorKeyWords.CONTAINS, 'drea')
    .Return()
    .OrderBy('n.firstname ASC');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname CONTAINS 'drea'\nRETURN n\nORDER BY n.firstname ASC;");
});

test('Test key word "Match", "Where" and "Skip" to build statement', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where('n.firstname', CypherOperatorKeyWords.CONTAINS, 'drea')
    .Return()
    .Skip(9);
  
  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname CONTAINS 'drea'\nRETURN n\nSKIP 9;");
});

test('Test key word "Match", "Where" and "Limit" to build statement', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where('n.firstname', CypherOperatorKeyWords.CONTAINS, 'drea')
    .Return()
    .Limit(100);
  
  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname CONTAINS 'drea'\nRETURN n\nLIMIT 100;");
});

test('Test key word "Match", "Where" and "Skip" and "Limit" to build statement', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where('n.firstname', CypherOperatorKeyWords.CONTAINS, 'drea')
    .Return()
    .Skip(50)
    .Limit(100);

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname CONTAINS 'drea'\nRETURN n\nSKIP 50\nLIMIT 100;");
});

test('Test key word "Match" and "Where" to build correct where statements', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where()
    .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
    .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
    .OR()
    .AND(CypherOperatorKeyWords.EQUAL_THAN, 'n.lastname', 'Kohlhaas')
    .AND(CypherOperatorKeyWords.ENDS_WITH, 'n.firstname', 'eas')
    .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE (exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre') OR (n.lastname='Kohlhaas' AND n.firstname ENDS WITH 'eas')\nRETURN n;");
});

test('Test key word "Match" and "Where" to build correct where statements without or', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where()
    .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
    .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
    .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n;");
});

test('Test connected "MATCH" statements with "WHERE"', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where()
    .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
    .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
    .Match('u', 'Person')
    .Where('u.firstname', CypherOperatorKeyWords.STARTS_WITH, 'Andreas')
    .AND(CypherOperatorKeyWords.GREATER_EQUAL_THAN, 'u.age', 25)
    .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nMATCH (u:Person)\nWHERE u.firstname STARTS WITH 'Andreas' AND u.age>=25\nRETURN n,u;");
});

test('Test connected "MATCH" statements with "Relate" and "ToNode" method', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Relate('HAS_CONTACT', 'rHasContact')
    .ToNode(['Person'], 'u')
    .Where()
    .AND(CypherOperatorKeyWords.STARTS_WITH, 'n.firstname', 'Andr')
    .Return();
 
  it.is<string>(builder.getQuery(), "MATCH (n:Person)-[rHasContact:HAS_CONTACT]-(u:Person)\nWHERE n.firstname STARTS WITH 'Andr'\nRETURN n,u;");
});

test('Test multiple Cypher statements.', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where('n.firstname', CypherOperatorKeyWords.IS_NOT_NULL)
  .Match('n')
  .Relate('HAS_CONTACT', 'rHasContact')
  .ToNode(['Person'], 'u')
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE n.firstname IS NOT NULL\nMATCH (n)-[rHasContact:HAS_CONTACT]-(u:Person)\nRETURN n,u;");
});