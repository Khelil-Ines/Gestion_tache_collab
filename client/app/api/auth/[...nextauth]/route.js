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
              if (response.status === 200) {
                const user = {
                  email: credentials.email, 
                  firstname: response.data.firstname, 
                  role: response.data.role,
                  accessToken: response.data.token,
                };
                console.log("Authentication successful. Server response:", response.data);
                return user;
              } else {
                console.log("Authentication failed. Server response:", response.data);
                return null;
              }
        } catch (error) {
          console.log("Error during authentication:", error);

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