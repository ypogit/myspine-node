export interface UserToken {
  id: number,
  user_id: number,
  access_token: string,
  refresh_token: string,
  access_token_expires_at: Date
}