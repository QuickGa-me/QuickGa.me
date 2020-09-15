export const Game = 1;
/*
import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {SuccessResponse} from '@common/models/http/successResponse';
import {
    CreateGameRequest,
    CreateGameResponse,
    GetAllGamesResponse,
    GetGameResponse,
    GetLiveGameResponse,
    UpdateGameRequest
} from '@common/models/http/gameController';
import {DBGame} from '@serverCommon/db/models/dbGame';
import {AuthService} from '../auth/auth.service';
import {DBLiveGame} from '@serverCommon/db/models/dbLiveGame';
import {AuthGuard} from '../guards/authGuard';
import {UserModel} from '@common/models/user/userModel';

@Controller('games')
export class GameController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    async getAllGames(): Promise<SuccessResponse<GetAllGamesResponse>> {
        return SuccessResponse.success({
            games: (await DBGame.db.getAll()).map(g => ({
                gameName: g.gameName,
                gameId: g._id.toHexString(),
                gameConfig: g.gameConfig!
            }))
        });
    }

    @Get('/:gameId')
    async getGame(@Param('gameId') gameId: string): Promise<SuccessResponse<GetGameResponse>> {
        let dbGame = await DBGame.db.getById(gameId);
        if (!dbGame) {
            return SuccessResponse.fail();
        }
        return SuccessResponse.success({
            game: {
                gameName: dbGame.gameName,
                gameId: dbGame._id.toHexString(),
                gameConfig: dbGame.gameConfig!
            }
        });
    }

    @UseGuards(AuthGuard)
    @Get('/live/:liveGameId')
    async getLiveGame(
        @Param('liveGameId') liveGameId: string,
        @Req() req: {user: UserModel}
    ): Promise<SuccessResponse<GetLiveGameResponse>> {
        debugger;
        console.log(liveGameId);
        let dbLiveGame = await DBLiveGame.db.getById(liveGameId);
        if (!dbLiveGame) {
            return SuccessResponse.fail();
        }
        let dbGame = await DBGame.db.getById(dbLiveGame.gameId);
        if (!dbGame) {
            return SuccessResponse.fail();
        }

        let found = false;
        for (let user of dbLiveGame.users) {
            if (user.id === req.user.id) {
                found = true;
            }
        }
        if (!found) {
            return SuccessResponse.fail();
        }

        return SuccessResponse.success({
            liveGame: {
                gameName: dbGame.gameName,
                gameId: dbGame._id.toHexString(),
                gameConfig: dbGame.gameConfig!,
                clientSource: dbGame.clientSource!,
                gameServerAddress: dbLiveGame.gameServerAddress
            }
        });
    }

    @Post('/:gameId')
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

    @Put('/')
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
*/
