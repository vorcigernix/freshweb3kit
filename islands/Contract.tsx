/** @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { ethers, providers } from "ethers";

interface ContractProps {
	name: string;
}

export default function Contract(props: ContractProps) {
	const [daiName, setDaiName] = useState(props.name);
	const [connected, setConnected] = useState(true);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		async function checkConnection() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const addresses = await provider.listAccounts();
			if (addresses.length) {
				setConnected(true);
			} else {
				setConnected(false);
			}
		}
		checkConnection();
	}, []);

	async function callContract() {
		setLoading(true);
		try {
			const provider = new providers.Web3Provider(window.ethereum);
			// You can also use an ENS name for the contract address
			const daiAddress = "dai.tokens.ethers.eth";

			// The ERC-20 Contract ABI, which is a common contract interface
			// for tokens (this is the Human-Readable ABI format)
			const daiAbi = [
				// Some details about the token
				"function name() view returns (string)",

				// Get the account balance
				"function balanceOf(address) view returns (uint)",
			];

			// The Contract object
			const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
			// @ts-ignore: Deno is not aware of ABIs
			const daiName = await daiContract.name();
			setDaiName(daiName);
		} catch (err) {
			console.log("error: ", err);
		}
		setLoading(false);
	}

	return (
		<aside
			class={tw`p-12 pt-48 sm:p-16 sm:pt-64 bg-gradient-to-r from-purple-600 to-blue-500`}>
			<div class={tw`sm:items-end sm:justify-between sm:flex`}>
				<div class={tw`max-w-xl`}>
					<p class={tw`text-3xl font-bold text-white sm:text-4xl`}>
						Call Smart Contracts like there is no tommorow.
					</p>
				</div>

				<button
					disabled={!IS_BROWSER}
					onClick={callContract}
					class={tw`inline-block px-8 py-4 mt-4 text-blue-500 bg-white rounded-lg shadow-lg hover:opacity-75 sm:mt-0 sm:ml-8 disabled:(opacity-10 cursor-not-allowed)`}>
					{loading ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							class={tw`w-5 h-5 sm:h-8 sm:w-8`}
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							stroke-width='2'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
							/>
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							class={tw`w-5 h-5 sm:h-8 sm:w-8`}
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M17 8l4 4m0 0l-4 4m4-4H3'
							/>
						</svg>
					)}
				</button>
			</div>
			<p class={tw`flex-grow-1 text-white font-bold text-xl`}>{daiName}</p>
		</aside>
	);
}
