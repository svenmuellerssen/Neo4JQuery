import {test} from 'ava';

import { CypherStringFunctionKeyWords } from '../src/lib/Builder/CypherStringFunctionKeyWords';
import { Builder } from '../src/lib/Builder/Builder';
import { CypherOperatorKeyWords } from '../src/lib/Builder/CypherOperatorKeyWords';
//import { TestConfiguration } from './TestConfiguration';

let builder: Builder = Builder.instance();


test('Test basic functionality like bolt/rest driver', it => {
  it.deepEqual<Builder>(builder, new Builder());
});

test('Test "MATCH" with "WHERE" and string function "exists" in "RETURN"', it => {
  builder
    .reset()
    .Match('n', 'Person')
    .Where()
    .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
    .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
    .Return()
    .Exists('n.firstname'); 
  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,exists(n.firstname);");
});

test('Test "MATCH" with "WHERE" and string function "exists" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Exists('n.firstname')
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND exists(n.firstname)\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "left" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .OR()
  .Left('BlaBlaBla', 4)
  .Return(); 
  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE (exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre') OR (left('BlaBlaBla',4))\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "left" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .Return()
  .Left('BlaBlaBla', 4); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,left('BlaBlaBla',4);");
});

test('Test "MATCH" with "WHERE" and string function "ltrim" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .LTrim('    BlaBlaBla');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,ltrim('    BlaBlaBla');");
});

test('Test "MATCH" with "WHERE" and string function "ltrim" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .LTrim('    BlaBlaBla')
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND ltrim('    BlaBlaBla')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "replace" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Replace('BlaBlaBla', 'aB', 'Ba');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,replace('BlaBlaBla','aB','Ba');");
});

test('Test "MATCH" with "WHERE" and string function "replace" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Replace('BlaBlaBla', 'aB', 'Ba')
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND replace('BlaBlaBla','aB','Ba')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "reverse" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Reverse('BlaBlaBla');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,reverse('BlaBlaBla');");
});

test('Test "MATCH" with "WHERE" and string function "reverse" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .Reverse('BlaBlaBla') 
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND reverse('BlaBlaBla')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "right" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Right('BlaBlaBla', 5);

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,right('BlaBlaBla',5);");
});

test('Test "MATCH" with "WHERE" and string function "right" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .Right('BlaBlaBla', 5) 
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND right('BlaBlaBla',5)\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "rtrim" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .RTrim('BlaBlaBla');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,rtrim('BlaBlaBla');");
});

test('Test "MATCH" with "WHERE" and string function "rtrim" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .RTrim('BlaBlaBla') 
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND rtrim('BlaBlaBla')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "split" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Split('BlaBlaBla', 'a');

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,split('BlaBlaBla','a');");
});

test('MATCH" with "WHERE" and string function "split" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .Split('BlaBlaBla', 'a') 
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND split('BlaBlaBla','a')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "substring" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Substring('BlaBlaBla', 3);

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,substring('BlaBlaBla',3);");
});

test('Test "MATCH" with "WHERE" and string function "substring" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .Substring('BlaBlaBla', 3) 
  .Return();

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND substring('BlaBlaBla',3)\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "substring" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .Substring('BlaBlaBla', 3, 3); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,substring('BlaBlaBla',3,3);");
});

test('Test "MATCH" with "WHERE" and string function "toLower" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .ToLower('BlaBlaBla'); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,toLower('BlaBlaBla');");
});

test('Test "MATCH" with "WHERE" and string function "toLower" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .ToLower('BlaBlaBla') 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toLower('BlaBlaBla')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "toUpper" in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .ToUpper('BlaBlaBla'); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,toUpper('BlaBlaBla');");
});

test('Test "MATCH" with "WHERE" and string function "toUpper" in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .ToUpper('BlaBlaBla') 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toUpper('BlaBlaBla')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "toString" with a number value in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .ToString(234543); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,toString('234543');");
});

test('MATCH" with "WHERE" and string function "toString" with a number value in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .ToString(234543) 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toString('234543')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and string function "toString" with a boolean value in "RETURN"', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre') 
  .Return()
  .ToString(false); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre'\nRETURN n,toString('false');");
});

test('Test "MATCH" with "WHERE" and string function "toString" with a boolean value in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .ToString(false) 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toString('false')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and several string functions in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .ToString(false)
  .Exists('n.lastname')
  .LTrim('    BlaBlubb  ') 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE toString('false') AND exists(n.lastname) AND ltrim('    BlaBlubb  ')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and several string functions in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_TO_STRING, {original: false})
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_EXISTS, {original: 'n.lastname'})
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_LTRIM, {original: '    BlaBlubb  '}) 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE toString('false') AND exists(n.lastname) AND ltrim('    BlaBlubb  ')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and several string functions in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_TO_STRING, {original: false})
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_EXISTS, {original: 'n.lastname'})
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_LTRIM, {original: '    BlaBlubb  '}) 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toString('false') AND exists(n.lastname) AND ltrim('    BlaBlubb  ')\nRETURN n;");
});

test('Test "MATCH" with "WHERE" and several string functions in "WHERE" segment', it => {
  builder
  .reset()
  .Match('n', 'Person')
  .Where()
  .AND(CypherOperatorKeyWords.FUNCTION_EXISTS, 'n.firstname')
  .AND(CypherOperatorKeyWords.NOT_CONTAINS, 'n.firstname', 'Andre')
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_TO_STRING, {original: false})
  .OR()
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_EXISTS, {original: 'n.lastname'})
  .AndFunction(CypherStringFunctionKeyWords.FUNCTION_LTRIM, {original: '    BlaBlubb  '}) 
  .Return(); 

  it.is<string>(builder.getQuery(), "MATCH (n:Person)\nWHERE (exists(n.firstname) AND NOT n.firstname CONTAINS 'Andre' AND toString('false')) OR (exists(n.lastname) AND ltrim('    BlaBlubb  '))\nRETURN n;");
});