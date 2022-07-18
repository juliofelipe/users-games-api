import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .where(`title ILIKE :param`, { param: `%${param}%`})
      .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM games`); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await getRepository(User)
      .createQueryBuilder(`users`)
      .innerJoin('users_games_games', 'users_games_games', 'users_games_games.usersId = users.id')
      .select('users.*')
      .where('users_games_games.gamesId = :id', {id})
      .getRawMany();
  }
}
