import {Controller, Get} from '@nestjs/common';
import {Game} from "@common/models/db/game";
import {DataManager} from "../../db/dataManager";


@Controller('games')
export class GameController {
    @Get()
    async getAllGames(): Promise<Game[]> {
        return await DataManager.getAll<Game>("game")
    }
}