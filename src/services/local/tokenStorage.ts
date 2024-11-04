export const tokenStorage = {
  setAccessToken: (token: string) => {
    localStorage.setItem("access_token", token);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("access_token");
  },

  setUserEmail: (email: string) => {
    localStorage.setItem("user_email", email);
  },

  getUserEmail: (): string | null => {
    return localStorage.getItem("user_email");
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
  },
};
