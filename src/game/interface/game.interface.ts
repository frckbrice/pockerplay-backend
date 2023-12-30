export interface GameType {
  id?: string;
  gamesession_id?: string;
  round: any;
  message_hint?: string;
  player_choice: string;
  proposals: string;
  player_id: string;
  role?: string;
  category?: string;
  choice_id?: string;
}

export interface GameGuessType {
  round_id?: string;
  choice_id?: string;
  player_guess?: string;
  player_id?: string;
  role?: string;
  gamesession_id?: string;
  category?: string;
  proposals?: string[];
}
