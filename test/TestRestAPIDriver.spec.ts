import {test} from 'ava';

// import { Driver } from '../src/lib/Driver/Driver';
// import { hasOwnProperty } from 'tslint/lib/utils';
// import { Rest, RestAPIConfig } from '../src/index';
// import { TestConfiguration } from './TestConfiguration';

// let restApiDriver: Rest|null = null,
//   restApiConfig: RestAPIConfig; 

// xdescribe('Test REST API driver', () => {

//   beforeAll( (done) => {
//     restApiConfig = new RestAPIConfig(new TestConfiguration().rest);
//     restApiDriver = Rest.instance(restApiConfig);
//     done();
//   });

//   it('Test new instance of REST API wrapper', () => { 
//     expect(restApiDriver).not.toBeNull();
//   });

//   it('Test REST driver type to be type Rest', () => {
//     expect(restApiDriver.getType()).toEqual(Driver.DRIVER_TYPE_HTTP); 
//   });

//   it('Test can connect the database', () => {
//     expect(restApiDriver.canConnect()).toBeTruthy(); 
//   });

//   it('Test connecting database', () => {
//     expect(restApiDriver.connect(null)).not.toBeNull();
//   });

//   it('Test cypher query execution', (done) => {
//     const cypherQuery = 'MATCH (n) WHERE id(n) = 0 RETURN n';
//     restApiDriver.execute(cypherQuery, {}).then( (data) => {
//       expect(data).not.toBeUndefined();
//       expect(data).not.toBeNull();
//       /**
//        * Object(results: [
//        *   Object(columns: ['n'], data: Object(row: [{<Fetched data>}], meta: [Object(id: <id>, type: 'node/relationship', deleted: false)])), 
//        *   ...
//        * ])
//        */
//       expect(data.results).not.toBeUndefined();
//       expect(data.results instanceof Array).toBeTruthy();
//       expect(data.results.length).toEqual(1);
//       expect(data.results[0]).hasOwnProperty('columns');
//       done();
//     });
//   });

//   it('Test closing REST driver', () => {
//     restApiDriver.close();
//     expect(restApiDriver.canConnect()).toBeFalsy(); 
//   });

//   afterAll( (done) => {
//     restApiDriver.close();
//     done();
//   });
// });

test('', it => {
  it.truthy(true);
});