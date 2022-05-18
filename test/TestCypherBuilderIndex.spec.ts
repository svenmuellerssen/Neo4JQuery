
import {test} from 'ava';
import { Builder } from '../src/lib/Builder/Builder';

const builder: Builder = Builder.instance();

test('Test "CREATE INDEX ON"', it => {
  builder
    .reset()
    .CreateIndexOn('Contact', ['firstname', 'lastname', 'position']);
  
  it.is<string>(builder.getQuery(), "CREATE INDEX ON :Contact(firstname,lastname,position);");
});

test('Test "USING INDEX ON"', it => {
  builder
    .reset()
    .UsingIndexOn('contact', 'Contact', ['firstname', 'lastname', 'position']);

  it.is<string>(builder.getQuery(), "USING INDEX ON contact:Contact(firstname,lastname,position);");
});

test('Test "DROP INDEX ON"', it => {
  builder
    .reset()
    .DropIndexOn('Contact', ['firstname', 'lastname', 'position']);

  it.is<string>(builder.getQuery(), "DROP INDEX ON :Contact(firstname,lastname,position);");
});