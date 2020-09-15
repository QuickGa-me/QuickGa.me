import {SDTypeLookup, SDTypeLookupElements} from '../schemaDefiner/schemaDefinerTypes';
import {SchemaDefiner} from '../schemaDefiner/schemaDefiner';

type CTOSJoin = {type: 'join'};

export type ClientToServerMessage = CTOSJoin;

const CTOSJoinSchema: SDTypeLookup<ClientToServerMessage, 'join'> = {};
const ClientToServerSchema: SDTypeLookupElements<ClientToServerMessage> = {
  flag: 'type-lookup',
  elements: {
    join: CTOSJoinSchema,
  },
};
export const ClientToServerSchemaReaderFunction = SchemaDefiner.generateReaderFunction(ClientToServerSchema);
export const ClientToServerSchemaAdderFunction = SchemaDefiner.generateAdderFunction(ClientToServerSchema);
export const ClientToServerSchemaAdderSizeFunction = SchemaDefiner.generateAdderSizeFunction(ClientToServerSchema);
