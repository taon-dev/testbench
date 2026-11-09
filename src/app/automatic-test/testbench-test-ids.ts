export enum TestbenchTest {
  getBoolean = 'getBoolean',
  getNumber = 'getNumber',
  getZero = 'getZero',
  getString = 'getString',
  getEmptyString = 'getEmptyString',
  getNull = 'getNull',
  getStringArray = 'getStringArray',
  getNumberArray = 'getNumberArray',
  getObject = 'getObject',
  getMappedObject = 'getMappedObject',
  getMappedObjectRawJson = 'getMappedObjectRawJson',
  getMappedObjectArray = 'getMappedObjectArray',
  getMappedObjectArrayRawJson = 'getMappedObjectArrayRawJson',
  getMixedObject = 'getMixedObject',
  getSerializationEdgeCases = 'getSerializationEdgeCases',
  throwError = 'throwError',

  bodyMappedUserWithCircuralFromClient = 'bodyMappedUserWithCircuralFromClient',
  bodyMappedUserWithCircuralFromServer = 'bodyMappedUserWithCircuralFromServer',
  bodyMappedUser = 'bodyMappedUser',
  bodyNestedMappedEntities = 'bodyNestedMappedEntities',
  bodyNumber = 'bodyNumber',
  bodyBoolean = 'bodyBoolean',
  bodyString = 'bodyString',

  queryNumber = 'queryNumber',
  queryBoolean = 'queryBoolean',
  queryString = 'queryString',
  queryMappedUser = 'queryMappedUser',
  queryNestedMappedEntities = 'queryNestedMappedEntities',
  queryMappedUserWithCircuralFromClient = 'queryMappedUserWithCircuralFromClient',

  shouldTranslateMessage = 'shouldTranslateMessage',
}

export type TestbenchTestId = TestbenchTest;
