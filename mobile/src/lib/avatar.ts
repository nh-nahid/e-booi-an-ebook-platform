import { API_ORIGIN } from "./config";

export const avatarUri = (avatar: string | null | undefined): string | undefined =>
  !avatar ? undefined : /^https?:/.test(avatar) ? avatar : `${API_ORIGIN}/uploads/avatars/${avatar}`;
