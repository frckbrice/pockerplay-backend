import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Option } from 'src/options/models/option.model';
import { Socket } from 'net';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`user ${client} has connected`);
  }

  handleDisconnect(client: any) {
    console.log(`user ${client} disconnected`);
  }

  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
