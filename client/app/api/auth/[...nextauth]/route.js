import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        try {
            const response = await axios.post(`http://localhost:5000/login`, {
                email: credentials.email,
                password: credentials.password,
              });

              if (response.status === 201) {
                const user = {
                  email: credentials.email,
                  accessToken: response.data.token,
                };
              
                return user;
              } else {

                return null;
              }
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };