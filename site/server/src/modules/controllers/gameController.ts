import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {DBGame} from "../../db/models/game";
import {SuccessResponse} from "@common/models/http/successResponse";
import {CreateGameRequest, CreateGameResponse, GetAllGamesResponse, GetGameResponse, UpdateGameRequest} from "@common/models/http/gameController";


@Controller('games')
export class GameController {

    @Get()
    async getAllGames(): Promise<SuccessResponse<GetAllGamesResponse>> {
        return SuccessResponse.success({
            games: (await DBGame.db.getAll())
                .map(g => ({
                    gameName: g.gameName,
                    gameId: g._id.toHexString(),
                    gameConfig: g.gameConfig
                }))
        });
    }

    @Get("/:gameId")
    async getGame(@Param('gameId') gameId: string): Promise<SuccessResponse<GetGameResponse>> {
        let dbGame = await DBGame.db.getById(gameId);
        if (!dbGame) {
            return SuccessResponse.fail();
        }
        return SuccessResponse.success({
            game: {
                gameName: dbGame.gameName,
                gameId: dbGame._id.toHexString(),
                gameConfig: dbGame.gameConfig
            }
        });
    }

    @Post("/:gameId")
    async updateGame(@Param('gameId') gameId: string, @Body() model: UpdateGameRequest): Promise<SuccessResponse> {
        try {
            let game = await DBGame.db.getById(gameId);
            game.clientSource = model.clientSource;
            game.serverSource = model.serverSource;
            game.gameConfig = model.gameConfig;
            await DBGame.db.updateDocument(game);
            return SuccessResponse.success();
        } catch (ex) {
            console.log(gameId, model);
            console.error(ex);
            return SuccessResponse.fail();
        }
    }

    @Put("/")
    async createGame(@Body() model: CreateGameRequest): Promise<SuccessResponse<CreateGameResponse>> {
        try {
            const game = new DBGame();
            game.gameName = model.gameName;
            await DBGame.db.insertDocument(game);
            return SuccessResponse.success({gameId: game._id.toHexString()});
        } catch (ex) {
            console.error(ex);
            return SuccessResponse.fail();
        }
    }
}
