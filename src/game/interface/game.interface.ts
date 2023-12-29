export interface GameType {
  id?: string;
  gamesession_id?: string;
  round_id: string;
  message_hint?: string;
  player_choice: string;
  proposals: string;
  player_id: string;
  role?: string;
  category?: string;
}

export interface GameGuessType {
  round_id?: string;
  choice_id?: string;
  player_guess?: string;
  player_id?: string;
  role?: string;
  gamesession_id?: string;
  category?: string;
}
