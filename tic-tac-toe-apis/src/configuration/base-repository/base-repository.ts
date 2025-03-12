import { DataSource, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(type: EntityTarget<T>, dataSource: DataSource) {
    super(type, dataSource.createEntityManager());
  }

  findOneByCondition(
    condition: object | [],
    select?: string[],
  ): Promise<T | undefined> {
    return this.findOne({ where: condition, select });
  }
}
