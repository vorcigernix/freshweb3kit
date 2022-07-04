/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

//import Wallet from "../islands/Wallet.tsx";
import Navigation from "../islands/Navigation.tsx";
import Contract from "../islands/Contract.tsx";

export default function Home() {
	return (
		<div>
			<Navigation />
			<Contract name='' />
		</div>
	);
}
