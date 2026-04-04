import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ClientInput {
  throttle: number;
  steer: number;
  brake: boolean;
  timestamp: number;
}

interface RaceInit {
  matchId: string;
  playerId: string;
  trackId: string;
}

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] })
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  private players = new Map<string, ClientInput>();

  afterInit() {
    console.log('Game Gateway initialized');
    setInterval(() => this.runPhysicsTick(), 100);
  }

  @SubscribeMessage('join_race')
  handleJoinRace(@MessageBody() data: RaceInit, @ConnectedSocket() client: Socket) {
    client.join(data.matchId);
    client.data.playerId = data.playerId;
    client.data.matchId = data.matchId;
    this.server.to(data.matchId).emit('race_event', { type: 'joined', playerId: data.playerId });
  }

  @SubscribeMessage('input')
  handleInput(@MessageBody() input: ClientInput, @ConnectedSocket() client: Socket) {
    const playerId = client.data.playerId || client.id;
    this.players.set(playerId, input);
  }

  runPhysicsTick() {
    if (this.players.size === 0) return;
    const state = [];
    this.players.forEach((input, playerId) => {
      state.push({ playerId, x: Math.random() * 100, y: Math.random() * 100, velocity: input.throttle * 10 });
    });
    this.server.emit('race_state', { ts: Date.now(), state });
  }

  @SubscribeMessage('leave_race')
  handleLeave(@ConnectedSocket() client: Socket) {
    const matchId = client.data.matchId;
    const pid = client.data.playerId;
    if (matchId) {
      client.leave(matchId);
      this.server.to(matchId).emit('race_event', { type: 'left', playerId: pid });
    }
    this.players.delete(pid);
  }
}
