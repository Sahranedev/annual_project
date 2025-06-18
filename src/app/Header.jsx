"use client";

import { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, ChevronDownIcon, UserCircleIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ApiHelper from "./ApiHelper";

export default function Header() {
	const [headerData, setHeaderData] = useState({});
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeMegaMenu, setActiveMegaMenu] = useState(null);

	useEffect(() => {
		const getHeader = async () => {
			let url = "header";
			url += "?populate[0]=logo";
			url += "&populate[1]=links";
			url += "&populate[2]=links.img";
			url += "&populate[3]=links.sublinks";
			url += "&populate[4]=links.sublinks.img";

			const { data } = await ApiHelper(url, "GET");
			if (data) {
				setHeaderData(data);
			}
		};

		getHeader();
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		setActiveMegaMenu(null);
	};

	const toggleMegaMenu = (linkId) => {
		setActiveMegaMenu(activeMegaMenu === linkId ? null : linkId);
	};

	return (
		<header className="w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50 relative">
			<nav className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					{"logo" in headerData && (
						<div className="flex-shrink-0">
							<img
								src={"http://localhost:1337" + headerData.logo.url}
								alt={headerData.logo.alternativeText}
								className="h-8 w-auto"
							/>
						</div>
					)}

					{/* Navigation pour desktop */}
					<div className="hidden md:flex items-center space-x-8">
						{"links" in headerData && headerData.links.map((link) => (
							<div onMouseEnter={() => toggleMegaMenu(link.id)}
								onMouseLeave={() => toggleMegaMenu(link.id)} key={link.id} className="group">
								<div className="flex items-center">
									<a
										key={link.id}
										href={link.url}
										className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
									>
										{link.label}
									</a>
									{link.sublinks && link.sublinks.length > 0 && <ChevronDownIcon className="h-4 w-4 text-gray-700" />}
								</div>

								{/* Mega Menu */}
								{link.sublinks && link.sublinks.length > 0 && activeMegaMenu === link.id && (
									<div className="absolute left-0 w-screen max-w-screen-xl transform px-2 sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
										<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
											<div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
												{link.sublinks.map((sublink) => (
													<a
														key={sublink.id}
														href={sublink.url}
														className="flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
													>
														{sublink.img && (
															<img
																src={"http://localhost:1337" + sublink.img.url}
																alt={sublink.img.alternativeText}
																className="h-6 w-6 mr-4"
															/>
														)}
														<div>
															<p className="text-base font-medium text-gray-900">
																{sublink.label}
															</p>
														</div>
													</a>
												))}
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Boutons de droite (toujours visibles) */}
					<div className="flex items-center space-x-4">
						<a href="/cart" className="text-gray-700 hover:text-gray-900">
							<ShoppingCartIcon className="h-6 w-6" />
						</a>

						<a href="/profile" className="text-gray-700 hover:text-gray-900">
							<UserCircleIcon className="h-6 w-6" />

						</a>

						{/* Bouton menu burger (mobile uniquement) */}
						<button
							onClick={toggleMenu}
							className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
						>
							{isMenuOpen ? (
								<XMarkIcon className="h-6 w-6" />
							) : (
								<Bars3Icon className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Menu mobile */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{"links" in headerData && headerData.links.map((link) => (
								<div key={link.id}>
									<div onClick={() => toggleMegaMenu(link.id)} className="flex justify-between items-center text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left">
										<a
											key={link.id}
											href={link.url}
											className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
										>
											{link.label}
										</a>
										{link.sublinks && link.sublinks.length > 0 && (activeMegaMenu === link.id ? <ChevronUpIcon className="h-4 w-4 text-gray-700" /> : <ChevronDownIcon className="h-4 w-4 text-gray-700" />)}
									</div>
									{/* <button
										onClick={() => toggleMegaMenu(link.id)}
										className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left"
									>
										<div className="flex justify-between items-center">
											{link.label}
										{link.sublinks && link.sublinks.length > 0 && (activeMegaMenu === link.id ? <ChevronUpIcon className="h-4 w-4 text-gray-700" /> : <ChevronDownIcon className="h-4 w-4 text-gray-700" />)}
										</div>
									</button> */}

									{/* Sous-menu mobile */}
									{link.sublinks && link.sublinks.length > 0 && activeMegaMenu === link.id && (
										<div className="pl-4">
											{link.sublinks.map((sublink) => (
												<a
													key={sublink.id}
													href={sublink.url}
													className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-sm"
												>
													{sublink.label}
												</a>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
