import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { ethers, providers } from "ethers";

export default function Navigation() {
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

	async function signIn() {
		try {
			const provider = new providers.Web3Provider(window.ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);
			setConnected(true);
		} catch (err) {
			console.log("error: ", err);
		}
	}

	return (
		<header class="bg-gray-900">
			<div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<div class="md:flex md:items-center md:gap-12">
						<a href='/' class="block text-blue-300">
							<span class="sr-only">Home</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								class="h-6 w-6"
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}>
								<path d='M12 14l9-5-9-5-9 5 9 5z' />
								<path d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' />
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
								/>
							</svg>
						</a>
					</div>

					<div class="hidden md:block">
						<nav aria-labelledby='header-navigation'>
							<h2 class="sr-only" id='header-navigation'>
								Header navigation
							</h2>

							<ul class="flex items-center gap-6 text-sm">
								<li>
									<a
										href='/islands'
										class="text-white transition hover:text-gray-50">
										App
									</a>
								</li>

								<li>
									<a
										href='/'
										class="text-white transition hover:text-gray-50">
										About
									</a>
								</li>
							</ul>
						</nav>
					</div>

					<div class="flex items-center gap-4">
						<div class="sm:gap-4 sm:flex">
							{connected ? (
								<div
									class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md shadow disabled:(bg-gray-800 border border-blue-600 opacity-50 cursor-not-allowed)">
									Connected
								</div>
							) : (
								<button
									onClick={signIn}
									class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md shadow disabled:(bg-gray-800 border border-blue-600 opacity-50 cursor-not-allowed)">
									Connect
								</button>
							)}
						</div>

						<div class="block md:hidden">
							<button
								class="p-2 text-white transition bg-gray-800 rounded hover:text-gray-50">
								<svg
									xmlns='http://www.w3.org/2000/svg'
									class="w-5 h-5"
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									stroke-width='2'>
									<path
										stroke-linecap='round'
										stroke-linejoin='round'
										d='M4 6h16M4 12h16M4 18h16'
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
