import type { AutomaticTestCase } from './automatic-test.types';
import { TestbenchTest } from './testbench-test-ids';

type TestDetails = Omit<AutomaticTestCase, 'run'>;

export const automaticTestDetails: readonly TestDetails[] = [
  {
    id: TestbenchTest.getBoolean,
    category: 'Response primitives',
    name: 'Boolean response',
    description: 'Deserializes a boolean response.',
  },
  {
    id: TestbenchTest.getNumber,
    category: 'Response primitives',
    name: 'Number response',
    description: 'Deserializes a floating-point response.',
  },
  {
    id: TestbenchTest.getZero,
    category: 'Response primitives',
    name: 'Zero response',
    description: 'Preserves zero as a numeric response.',
  },
  {
    id: TestbenchTest.getString,
    category: 'Response primitives',
    name: 'String response',
    description: 'Deserializes a plain string response.',
  },
  {
    id: TestbenchTest.getEmptyString,
    category: 'Response primitives',
    name: 'Empty string response',
    description: 'Preserves an empty string response.',
  },
  {
    id: TestbenchTest.getNull,
    category: 'Response primitives',
    name: 'Null response',
    description: 'Preserves an explicit null response.',
  },
  {
    id: TestbenchTest.getStringArray,
    category: 'Response primitives',
    name: 'String array response',
    description: 'Deserializes string arrays.',
  },
  {
    id: TestbenchTest.getNumberArray,
    category: 'Response primitives',
    name: 'Number array response',
    description: 'Deserializes number arrays.',
  },
  {
    id: TestbenchTest.getObject,
    category: 'Response primitives',
    name: 'Plain object response',
    description: 'Deserializes a plain JSON object.',
  },
  {
    id: TestbenchTest.getMixedObject,
    category: 'Response primitives',
    name: 'Mixed object response',
    description: 'Deserializes nested mixed values.',
  },
  {
    id: TestbenchTest.getSerializationEdgeCases,
    category: 'Serialization edge cases',
    name: 'Primitive and nested serialization edges',
    description:
      'Checks false, zero, negatives, decimals, Unicode, special characters, string lookalikes, empty containers, and nested arrays.',
  },
  {
    id: TestbenchTest.getMappedObject,
    category: 'Entity mapping',
    name: 'Mapped entity response',
    description:
      'Checks entity prototypes and computed getters after deserialization.',
  },
  {
    id: TestbenchTest.getMappedObjectRawJson,
    category: 'Entity mapping',
    name: 'Raw mapped entity JSON',
    description: 'Verifies raw JSON is not transformed into an entity.',
  },
  {
    id: TestbenchTest.getMappedObjectArray,
    category: 'Entity mapping',
    name: 'Mapped entity array',
    description: 'Checks entity mapping inside arrays.',
  },
  {
    id: TestbenchTest.getMappedObjectArrayRawJson,
    category: 'Entity mapping',
    name: 'Raw mapped entity array JSON',
    description: 'Verifies raw entity arrays remain plain JSON.',
  },
  {
    id: TestbenchTest.bodyMappedUser,
    category: 'Request parameters',
    name: 'Mapped entity body',
    description:
      'Posts an entity and checks its prototype and getter on the backend.',
  },
  {
    id: TestbenchTest.bodyNestedMappedEntities,
    category: 'Request parameters',
    name: 'Named mapped entity bodies',
    description: 'Posts multiple named entity body parameters.',
  },
  {
    id: TestbenchTest.bodyNumber,
    category: 'Request parameters',
    name: 'Numeric body parameter',
    description: 'Posts and validates a numeric body parameter.',
  },
  {
    id: TestbenchTest.bodyBoolean,
    category: 'Request parameters',
    name: 'Boolean body parameter',
    description: 'Posts and validates a boolean body parameter.',
  },
  {
    id: TestbenchTest.bodyString,
    category: 'Request parameters',
    name: 'String body parameter',
    description: 'Posts and validates a string body parameter.',
  },
  {
    id: TestbenchTest.queryNumber,
    category: 'Request parameters',
    name: 'Numeric query parameter',
    description: 'Serializes and parses a numeric query parameter.',
  },
  {
    id: TestbenchTest.queryBoolean,
    category: 'Request parameters',
    name: 'Boolean query parameter',
    description: 'Serializes and parses a boolean query parameter.',
  },
  {
    id: TestbenchTest.queryString,
    category: 'Request parameters',
    name: 'String query parameter',
    description: 'Serializes and parses a string query parameter.',
  },
  {
    id: TestbenchTest.queryMappedUser,
    category: 'Request parameters',
    name: 'Mapped entity query parameter',
    description: 'Checks entity query transformation and computed getters.',
  },
  {
    id: TestbenchTest.queryNestedMappedEntities,
    category: 'Request parameters',
    name: 'Named mapped entity query parameters',
    description: 'Parses multiple mapped entity query parameters.',
  },
  {
    id: TestbenchTest.bodyMappedUserWithCircuralFromClient,
    category: 'Circular references',
    name: 'Circular entity body',
    description: 'Round-trips a circular entity graph from the client.',
  },
  {
    id: TestbenchTest.bodyMappedUserWithCircuralFromServer,
    category: 'Circular references',
    name: 'Circular entity response',
    description:
      'Deserializes a circular entity graph returned by the backend.',
  },
  {
    id: TestbenchTest.queryMappedUserWithCircuralFromClient,
    category: 'Circular references',
    name: 'Circular entity query',
    description:
      'Round-trips a circular entity graph through query serialization.',
  },
  {
    id: TestbenchTest.shouldTranslateMessage,
    category: 'Localization',
    name: 'Translated response',
    description: 'Checks backend translations in English, Polish, and German.',
  },
  {
    id: TestbenchTest.throwError,
    category: 'HTTP errors',
    name: 'Backend exception propagation',
    description:
      'Verifies that a backend exception rejects the client request.',
  },
];
