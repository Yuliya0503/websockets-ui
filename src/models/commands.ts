export enum EOutCommands {
  REGISTER = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  FINISH = 'finish',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',
}

export enum EInCommands {
  REGISTER = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_PLAYER_TO_ROOM = 'add_player_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
}
