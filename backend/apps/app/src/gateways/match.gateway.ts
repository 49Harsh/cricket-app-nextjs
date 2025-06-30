import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinMatch')
  handleJoinMatch(client: Socket, matchId: string) {
    client.join(`match_${matchId}`);
    return { event: 'joinedMatch', data: { matchId } };
  }

  @SubscribeMessage('leaveMatch')
  handleLeaveMatch(client: Socket, matchId: string) {
    client.leave(`match_${matchId}`);
    return { event: 'leftMatch', data: { matchId } };
  }

  emitCommentaryUpdate(matchId: string, commentary: any) {
    this.server.to(`match_${matchId}`).emit('commentary', commentary);
  }

  emitMatchUpdate(matchId: string, match: any) {
    this.server.to(`match_${matchId}`).emit('matchUpdate', match);
  }
} 