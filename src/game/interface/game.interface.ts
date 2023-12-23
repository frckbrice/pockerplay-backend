export interface GameType {
  id?: string;
  gamesession_id?: string;
  round_id: string;
  message_hint?: string;
  player_choice: string;
  proposals: string;
  player_id: string;
  role?: string;
}

export interface GameGuessType {
  gamesession_id?: string;
  round_id: string;
  player_guess: string;
  player_id: string;
  role?: string;
}
