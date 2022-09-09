import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { ethers } from "ethers";

interface OraclePrice {
  description: string;
  price: number;
}

export const handler: Handlers<OraclePrice | null> = {
  async GET(_, ctx) {
    //const { parameter } = ctx.params; - this is how you get the parameter named parameter from the URL
    const infuraID = Deno.env.get("INFURA_ID")!;
    if (!infuraID) {
      //if running locally, you can set your Infura ID by writing something like "export INFURA_ID=91bd0cf1caaf40379d0b70ef7f113813". Refer to https://infura.io/ for an Infura ID.
      throw new Error("INFURA_ID is not set");
    }
    const provider = new ethers.providers.JsonRpcProvider(
      `https://rinkeby.infura.io/v3/${infuraID}`,
    );
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
    const priceFeed = new ethers.Contract(
      addr,
      aggregatorV3InterfaceABI,
      provider,
    );
    // @ts-ignore: Deno is not aware of ABIs
    const bigprice = await priceFeed.latestRoundData();
    if (!bigprice) {
      console.log("price is null");
      return ctx.render(null);
    }
    // @ts-ignore: Deno is not aware of ABIs
    const description = await priceFeed.description();
    const priceObj: OraclePrice = {
      description: description,
      price: ethers.utils.formatUnits(bigprice.answer, 8),
    };
    //console.log("price is ", bigprice.answer);
    return ctx.render(priceObj);
  },
};

export default function Home({ data }: PageProps<OraclePrice | null>) {
  return (
    <>
      <Head>
        <title>SuperFresh - a Web3 Fresh kit</title>
        <meta
          name="description"
          content="A sample repository you can use to bootstrap a web3 development on Deno framework called Fresh."
        />

        <meta property="og:url" content="https://superfresh.deno.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SuperFresh - a Web3 Fresh kit" />
        <meta
          property="og:description"
          content="A sample repository you can use to bootstrap a web3 development on Deno framework called Fresh."
        />
        <meta
          property="og:image"
          content=" https://superfresh.deno.dev/superfreshog.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="superfresh.deno.dev" />
        <meta property="twitter:url" content="https://superfresh.deno.dev/" />
        <meta name="twitter:title" content="SuperFresh - a Web3 Fresh kit" />
        <meta
          name="twitter:description"
          content="A sample repository you can use to bootstrap a web3 development on Deno framework called Fresh."
        />
        <meta
          name="twitter:image"
          content=" https://superfresh.deno.dev/superfreshog.png"
        />
      </Head>

      <section class="text-white bg-gray-900">
        <div class="max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-3xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
              SuperFresh Web3.
              <span class="sm:block">Increase Conversion.</span>
            </h1>

            <p class="max-w-xl mx-auto mt-4 sm:leading-relaxed sm:text-xl">
              This is a landing page example for the SuperFresh Web3. It shows a
              super fast static page rendering of Fresh framework with a
              sprinkle of web3 backend service used on server side.
            </p>

            <div class="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="https://github.com/vorcigernix/freshweb3kit"
                class="block w-full px-12 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded sm:w-auto active:text-opacity-75 hover:bg-transparent hover:text-white focus:outline-none focus:ring"
              >
                Github
              </a>

              <a
                href="/islands"
                class="block w-full px-12 py-3 text-sm font-medium text-white border border-blue-600 rounded sm:w-auto hover:bg-blue-600 active:bg-blue-500 focus:outline-none focus:ring"
              >
                App Page
              </a>
            </div>
            <p class="max-w-xl mx-auto mt-4 sm:leading-relaxed sm:text-xl">
              Current {data?.description} exchange rate is {data?.price}
            </p>
          </div>
        </div>
      </section>
      <div class="flex flex-col px-4 py-3 text-white bg-gray-800 items-center justify-center">
        <a href="https://fresh.deno.dev">
          <img
            width="197"
            height="37"
            class="m-2"
            src="https://fresh.deno.dev/fresh-badge-dark.svg"
            alt="Made with Fresh"
          />
        </a>
        <p class="text-sm font-medium text-center">
          UI Modules are built using &nbsp;
          <a class="underline" href="https://www.hyperui.dev/">
            HyperUI Components &rarr;
          </a>
        </p>
      </div>
    </>
  );
}
