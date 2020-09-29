import {ShadowableEntity} from '../baseEntities/shadowableEntity';
import {Entity} from '../baseEntities/entity';
import {BaseEntityModels} from '../baseEntities/entityTypes';

export class EntityUtils {
  static isShadow<EntityModels extends BaseEntityModels>(
    entity: Entity<EntityModels>
  ): entity is Entity<EntityModels> & ShadowableEntity {
    return 'shadowEntity' in entity && (entity as Entity<EntityModels> & ShadowableEntity).shadowEntity;
  }
  static isShadowEntity<EntityModels extends BaseEntityModels>(
    entity: Entity<EntityModels>
  ): entity is Entity<EntityModels> & ShadowableEntity {
    return 'shadowEntity' in entity;
  }
}
