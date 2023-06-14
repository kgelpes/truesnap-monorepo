import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { ThirdwebAuth } from "@thirdweb-dev/auth/express";
import { getDBUser, createUser } from "@truesnap/db";

// TODO: type env vars
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "";
const { authRouter, authMiddleware, getUser } = ThirdwebAuth({
  domain: process.env.THIRDWEB_AUTH_DOMAIN || "",
  wallet: new PrivateKeyWallet(PRIVATE_KEY),
  callbacks: {
    onLogin: async (address) => {
      const userResponse = await getDBUser(address);
      const user = userResponse.data;

      if (!user) {
        const response = await createUser(address, []);
        console.log("Created user", response);
      }
    },
    onUser: async (user) => {
      console.log("onUser", user);
      const userResponse = await getDBUser(user.address);

      return userResponse.data;
    },
  },
});

export { authRouter, authMiddleware, getUser };
