/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import { ethers } from "ethers";

interface EthPrice {
	price: number;
}

export const handler: Handlers<EthPrice | null> = {
	async GET(_, ctx) {
		//const { parameter } = ctx.params; - this is how you get the parameter named parameter from the URL
		const infuraID = Deno.env.get("INFURA_ID")!;
		if (!infuraID) {
			//if running locally, you can set your Infura ID by writing something like "export INFURA_ID=91bd0cf1caaf40379d0b70ef7f113813". Refer to https://infura.io/ for an Infura ID.
			throw new Error("INFURA_ID is not set");
		}
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rinkeby.infura.io/v3/${infuraID}`
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
			provider
		);
		// @ts-ignore: Deno is not aware of ABIs
		const bigprice = await priceFeed.latestRoundData();
		if (!bigprice) {
			console.log("price is null");
			return ctx.render(null);
		}
		const priceObj: EthPrice = {
			price: ethers.utils.formatUnits(bigprice.answer, 8),
		};
		console.log("price is ", priceObj.price);
		return ctx.render(priceObj);
	},
};

export default function Home({ data }: PageProps<EthPrice | null>) {
	return (
		<section class={tw`text-white bg-gray-900`}>
			<div
				class={tw`max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex`}>
				<div class={tw`max-w-3xl mx-auto text-center`}>
					<h1
						class={tw`text-3xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600`}>
						SuperFresh Web3.
						<span class={tw`sm:block`}>Increase Conversion.</span>
					</h1>

					<p class={tw`max-w-xl mx-auto mt-4 sm:leading-relaxed sm:text-xl`}>
						This is a landing page example for the SuperFresh Web3. It shows a
						super fast static page rendering of Fresh framework with a sprinkle
						of web3 backend service used on server side.
					</p>

					<div class={tw`flex flex-wrap justify-center gap-4 mt-8`}>
						<a
							href='https://github.com/vorcigernix/freshweb3kit'
							class={tw`block w-full px-12 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded sm:w-auto active:text-opacity-75 hover:bg-transparent hover:text-white focus:outline-none focus:ring`}>
							Github
						</a>

						<a
							href='/islands'
							class={tw`block w-full px-12 py-3 text-sm font-medium text-white border border-blue-600 rounded sm:w-auto hover:bg-blue-600 active:bg-blue-500 focus:outline-none focus:ring`}>
							App Page
						</a>
					</div>
					<p class={tw`max-w-xl mx-auto mt-4 sm:leading-relaxed sm:text-xl`}>
						Current price of Ethereum is: ${data?.price}
					</p>
				</div>
			</div>
		</section>
	);
}
