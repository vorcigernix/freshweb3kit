/** @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { ethers, providers } from "ethers";

interface WalletProps {
	address: string;
}

export default function Wallet(props: WalletProps) {
    if (!IS_BROWSER) {
        return <div>Loading...</div>;
    }
	const [userAddress, setUserAddress] = useState(props.address);
	const [connected, setConnected] = useState(true);
	useEffect(() => {
		async function checkConnection() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const addresses = await provider.listAccounts();
			if (addresses.length) {
				setConnected(true);
				setUserAddress(addresses[0]);
			} else {
				setConnected(false);
			}
		}
		checkConnection();
	}, []);

	async function signIn() {
		try {
			const accounts = await window.ethereum.send("eth_requestAccounts");
			setConnected(true);
			const account = accounts.result[0];
			setUserAddress(account);
		} catch (err) {
			console.log("error: ", err);
		}
	}

	return (
		<div class={tw`flex flex-col gap-2 w-full`}>
			<button
				class={tw`block w-full px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded sm:w-auto active:text-opacity-75 hover:bg-green-400 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed`}
				onClick={signIn}
                disabled={!IS_BROWSER}
                >
				Connect
			</button>
			<p class={tw`flex-grow-1 font-bold text-xl`}>{userAddress}</p>
		</div>
	);
}
