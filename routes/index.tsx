/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import Wallet from "../islands/Wallet.tsx";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <p class={tw`my-6`}>
        Welcome to `fresh web3 kit`. This is a simple web3 kit for bootstrapping a new web3 project using Deno and Fresh.
      </p>
      <Wallet address="not connected" />
      {/* <Counter start={3} /> */}

    </div>
  );
}
