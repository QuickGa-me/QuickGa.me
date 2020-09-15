import {SDArray, SDTypeLookup, SDTypeLookupElements} from '../schemaDefiner/schemaDefinerTypes';
import {SchemaDefiner} from '../schemaDefiner/schemaDefiner';

type STOCJoined = {
  type: 'joined';
};
export type ServerToClientMessage = STOCJoined;

const STOCJoinedSchema: SDTypeLookup<ServerToClientMessage, 'joined'> = {};

const ServerToClientSchema: SDArray<SDTypeLookupElements<ServerToClientMessage>> = {
  flag: 'array-uint16',
  elements: {
    flag: 'type-lookup',
    elements: {
      joined: STOCJoinedSchema,
    },
  },
};
export const ServerToClientSchemaReaderFunction = SchemaDefiner.generateReaderFunction(ServerToClientSchema);
export const ServerToClientSchemaAdderFunction = SchemaDefiner.generateAdderFunction(ServerToClientSchema);
export const ServerToClientSchemaAdderSizeFunction = SchemaDefiner.generateAdderSizeFunction(ServerToClientSchema);
