import {ClientEngine} from '../clientEngine';

export const ActorEntityTypes: {
  [key in EntityModels['type']]: new (engine: ClientEngine, entity: EntityType[key]['entity']) => ClientActor<
    EntityType[key]['entity']
  >;
} = {
  score: ScoreActor,
};
