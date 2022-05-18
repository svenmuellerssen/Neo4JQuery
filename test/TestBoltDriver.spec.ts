import {test} from 'ava';
import { Driver } from '../src/lib/Driver/Driver';
import { Bolt, BoltConfig } from '../src/index';
import { TestConfiguration } from './TestConfiguration';

const boltConfig: BoltConfig = new BoltConfig(new TestConfiguration().bolt),
  boltDriver: Bolt = Bolt.instance(boltConfig),
  sessionName: string = 'testSession';

  boltDriver.connect(null); 

test('Test bolt driver type to be type bolt', it => {
    it.is<number>(boltDriver.getType(), Driver.DRIVER_TYPE_BOLT);
});

test('Test Bolt driver has connection', it => {
  it.truthy(boltDriver.hasConnection());
  // it.falsy(boltDriver.hasConnection()); 
});

test('Test url looks like', it => {
  it.is<string>(boltDriver.getUrl(), 'bolt://' + boltConfig.server + ':' + boltConfig.port);
});

test('Test getting driver session', it => {
  const session = boltDriver.getSession(sessionName);
  it.not(session, void 0);
  // it.is(session, null);
  it.not(session, null);
});

test('Test cypher query execution', async (it) => {
  const cypherQuery = 'MATCH (n) WHERE id(n) = 0 RETURN n;';
  const value = await boltDriver.execute(sessionName, cypherQuery, {});
    value.then( (data:any) => {
      it.not(data, void 0);
      it.not(data, null);
      it.falsy(data.hasOwnProperty('message'));
      it.is<number>(data.length, 1);
      it.truthy(data[0].hasOwnProperty('n'));
    });
    value.catch( (error: any) => {
      console.log(error);
    });
    // await boltDriver.close();
    // it.falsy(boltDriver.hasConnection());
});

// test.serial('Test closing Bolt driver connection', it => {

// });