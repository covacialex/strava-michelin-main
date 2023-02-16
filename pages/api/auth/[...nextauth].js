import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";

const STRAVA_AUTHORIZATION_URL =
  "https://www.strava.com/api/v3/oauth/authorize?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

async function refreshAccessToken(token) {
  console.log("refresh", token);
  try {
    const url =
      "https://www.strava.com/api/v3/oauth/token" +
      new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_SECRET,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      });

    console.log("url:", url);

    const response = await fetch(url, {
      // headers: {
      //   "Content-Type": "application/x-www-form-urlencoded",
      // },
      method: "POST",
    });

    console.log("res", response);

    const refreshedTokens = await response.json();
    console.log("refreshed", refreshedTokens);

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_SECRET,
      authorization: {
        params: {
          scope: "activity:read_all",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      // if (Date.now() < token.accessTokenExpires) {
      //   return token;
      // }

      console.log("token", token);
      return token;

      // Access token has expired, try to update it
      if (new Date() > token.accessTokenExpires) {
        return refreshAccessToken(token);
      }
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
