import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axiosServer from "./utils/axiosServer";

export class InvalidLoginError extends CredentialsSignin {
  code = "custom";
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const formData = new FormData();
          formData.append("username", credentials?.username || "");
          formData.append("password", credentials?.password || "");
          const response = await axiosServer.post("/login", formData);

          // Expecting your FastAPI login() to return user data (e.g., { access_token, token_type, user })
          const user = response.data;

          if (!user) {
            throw new InvalidLoginError("Invalid login credentials");
          }

          return user; // NextAuth will store this in session
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.error || "Something went wrong";
            throw new InvalidLoginError(message);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        token.accessToken = user.access_token; // Store access_token in the token
        token.user = user.user; // Optional: store user info too if needed
      }
      return token;
    },
    async session({ session, token }) {
      // Make accessToken available in the session
      session.accessToken = token.accessToken;
      session.user = token.user; // Optional: overwrite the session user with token user
      return session;
    },
  },
});
