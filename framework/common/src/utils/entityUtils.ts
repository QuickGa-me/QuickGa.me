import {ShadowableEntity} from '../baseEntities';
import {Entity} from '../baseEntities';

export class EntityUtils {
  static isShadow(
    entity: Entity
  ): entity is Entity & ShadowableEntity {
    return 'shadowEntity' in entity && (entity as Entity & ShadowableEntity).shadowEntity;
  }
  static isShadowEntity(
    entity: Entity
  ): entity is Entity & ShadowableEntity {
    return 'shadowEntity' in entity;
  }
}
