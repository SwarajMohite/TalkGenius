export class Rooms {
  constructor() {
    this.rooms = new Map(); // roomId -> { users: Map(socketId -> {name}), chat: [] }
  }

  addUser(roomId, socketId, name) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { users: new Map(), chat: [] });
    }
    const room = this.rooms.get(roomId);
    room.users.set(socketId, { name });
  }

  getPeers(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return [...room.users.entries()].map(([socketId, { name }]) => ({ socketId, name }));
  }

  removeUser(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.users.has(socketId)) {
        const name = room.users.get(socketId).name;
        room.users.delete(socketId);
        if (room.users.size === 0) this.rooms.delete(roomId);
        return { roomId, name };
      }
    }
    return null;
    }

  appendChat(roomId, msg) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.chat.push(msg);
      if (room.chat.length > 200) room.chat.shift();
    }
  }

  getRecentChat(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.chat.slice(-40) : [];
  }
}
