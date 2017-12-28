import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {SuccessResponse} from "@common/models/http/successResponse";
import {Game} from "../../db/models/game";


@Controller('games')
export class GameController {
    @Get()
    async getAllGames(): Promise<Game[]> {
        return await Game.db.getAll();
    }

    @Post("/:gameId")
    async updateGame(@Param('gameId') gameId: string, @Body() model: UpdateGameRequest): Promise<SuccessResponse> {
        try {
            let game = await Game.db.getById(gameId);
            game.clientSource = model.clientSource;
            game.serverSource = model.serverSource;
            game.gameConfig = model.gameConfig;
            await Game.db.updateDocument(game);
            return {success: true};
        } catch (ex) {
            console.log(gameId, model);
            console.error(ex);
            return {success: false};
        }
    }
}

interface UpdateGameRequest {
    serverSource: string;
    clientSource: string;
    gameConfig: string;
}