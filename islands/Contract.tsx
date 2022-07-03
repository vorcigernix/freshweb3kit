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
			const daiName = await daiContract.name();
            setDaiName(daiName);
		} catch (err) {
			console.log("error: ", err);
		}
	}

	return (
		<div class={tw`flex flex-col gap-2 w-full`}>
			<div class={tw`flex flex-row gap-2 w-full`}>
				<button
					class={tw`block w-full px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded sm:w-auto active:text-opacity-75 hover:bg-green-400 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed`}
					disabled={!IS_BROWSER}
					onClick={callContract}>
					Contract
				</button>
			</div>
			<p class={tw`flex-grow-1 font-bold text-xl`}>{daiName}</p>
		</div>
	);
}
