export interface GameType {
  round_id: string;
  round_number: number;
  messageHint?: string;
  home_player_choice: string;
  proposals: string;
  home_player_id: string;
}
