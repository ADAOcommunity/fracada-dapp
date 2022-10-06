import { useEffect, useRef, useState } from 'react';
import { useWalletStore } from '../../utils/store';
import { FlintIcon } from './FlintIcon';
import { NamiIcon } from './NamiIcon';




const Fab = ({ children }: any) => {
	const walletStore = useWalletStore()

	const isConnected = (walletStore.address && walletStore.walletName) ? true : false

	const connectedWalletIcon = () => {
		switch (walletStore.walletName) {
			case 'nami':
				return <NamiIcon small={true} />
			case 'eternl':
				return <img className={'w-8 h-8'} src='/eternl.webp' />
			case 'flint':
				return <FlintIcon />
			default:
				return <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" className={'fill-gray-400'} stroke="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z" /></svg>
		}
	}

	const [fab, setFab] = useState(false);
	const floatingActionButton = useRef(null);

	const toggleFab = () => {
		setFab(!fab);
	};

	const handleEsc = (e: any) => {
		if (e.keyCode === 27) {
			setFab(false);
		}
	};


	useEffect(() => {
		window.addEventListener("keydown", handleEsc);
		// window.addEventListener("click", handleBodyClick);

		return () => {
			window.removeEventListener("keydown", handleEsc);
			// window.removeEventListener("click", handleBodyClick);
		};
	}, []);

	if (children.length > 4) {
		console.log("FAB has more than 3 items");
		return null;
	} else if (children.length <= 4 && children.length >= 1) {
		return (
			<div onClick={toggleFab} className={"radial-menu" + (fab ? " open" : "")}>
				<div
					className={
						"radial " + (children.length > 1 ? `radial-${children.length}-items` : ``)
					}
				>
					{children}
				</div>
				<div className="attention"></div>
				<a className="floating-action-button cursor-pointer" ref={floatingActionButton}>
					{
						!fab ?
							isConnected ?
								connectedWalletIcon() :
								<svg className={'w-[1.6rem] h-[1.6rem]'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" enableBackground="new 0 0 26 26" style={{ fill: "#fff" }}>
									<path style={{ textIndent: 0, textAlign: 'start', lineHeight: 'normal', textTransform: 'none', msBlockProgression: 'tb' }} d="M 24.875 0 A 1.0001 1.0001 0 0 0 24.28125 0.28125 L 22.625 1.9375 C 20.42105 0.3463983 17.363638 0.63179191 15.3125 2.59375 C 15.3125 2.6701204 14.457295 3.5035041 13.6875 4.25 L 12.71875 3.28125 A 1.0001 1.0001 0 0 0 11.90625 2.96875 A 1.0001 1.0001 0 0 0 11.78125 3 A 1.0001 1.0001 0 0 0 11.28125 4.71875 L 13.5625 7 L 10.28125 10.28125 A 1.016466 1.016466 0 1 0 11.71875 11.71875 L 15 8.4375 L 17.5625 11 L 14.28125 14.28125 A 1.016466 1.016466 0 1 0 15.71875 15.71875 L 19 12.4375 L 21.28125 14.71875 A 1.016466 1.016466 0 1 0 22.71875 13.28125 L 21.75 12.3125 L 23.40625 10.6875 C 25.366628 8.727122 25.564583 5.6795387 24.03125 3.40625 L 25.71875 1.71875 A 1.0001 1.0001 0 0 0 24.875 0 z M 3.90625 10.96875 A 1.0001 1.0001 0 0 0 3.78125 11 A 1.0001 1.0001 0 0 0 3.28125 12.71875 L 4.25 13.6875 L 2.59375 15.3125 C 0.63337202 17.272878 0.43541722 20.320461 1.96875 22.59375 L 0.28125 24.28125 A 1.016466 1.016466 0 1 0 1.71875 25.71875 L 3.375 24.0625 C 5.5789499 25.653602 8.636362 25.368208 10.6875 23.40625 C 10.6875 23.32988 11.542705 22.496496 12.3125 21.75 L 13.28125 22.71875 A 1.016466 1.016466 0 1 0 14.71875 21.28125 L 4.71875 11.28125 A 1.0001 1.0001 0 0 0 3.90625 10.96875 z" />
								</svg>
							: <></>
					}
				</a>
			</div>
		);
	} else {
		return (
			<div className="radial-menu">
				<div className="attention"></div>
				{children}
			</div>
		);
	}
};

const WalletButton = () => {
	const walletStore = useWalletStore()
	const connect = async (walletName: string) => {
		const walletApi = await window.cardano[walletName].enable()
		if (walletApi) {
			walletStore.setConnected(walletName, await walletApi.getChangeAddress())
		}
	}
	const isConnected = (walletStore.address && walletStore.walletName) ? true : false

	return (
		<Fab>
			<span
				className={"floating-action-button-item fas cursor-pointer"}
				id={'nami'}
				onClick={() => connect('nami')}
			>
				<NamiIcon />
			</span>
			<span
				className={"floating-action-button-item fas cursor-pointer"}
				id={'flint'}
				onClick={() => connect('flint')}
			>
				<FlintIcon />
			</span>
			<span
				className={"floating-action-button-item fas cursor-pointer"}
				id={'eternl'}
				onClick={() => connect('eternl')}
			>
				<img className={'w-10 h-10'} src='/eternl.webp' />
			</span>

			{isConnected ? <span
				className={"floating-action-button-item fas cursor-pointer"}
				id={'disconnect'}
				onClick={() => walletStore.disconnect()}
			>
				<svg className={'w-10 h-10'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" enableBackground="new 0 0 26 26" style={{ fill: "#b22222" }}>
					<path style={{ textIndent: 0, textAlign: 'start', lineHeight: 'normal', textTransform: 'none', msBlockProgression: 'tb' }} d="M 24.875 0 A 1.0001 1.0001 0 0 0 24.28125 0.28125 L 22.625 1.9375 C 20.42105 0.3463983 17.363638 0.63179191 15.3125 2.59375 C 15.3125 2.6701204 14.457295 3.5035041 13.6875 4.25 L 12.71875 3.28125 A 1.0001 1.0001 0 0 0 11.90625 2.96875 A 1.0001 1.0001 0 0 0 11.78125 3 A 1.0001 1.0001 0 0 0 11.28125 4.71875 L 13.5625 7 L 10.28125 10.28125 A 1.016466 1.016466 0 1 0 11.71875 11.71875 L 15 8.4375 L 17.5625 11 L 14.28125 14.28125 A 1.016466 1.016466 0 1 0 15.71875 15.71875 L 19 12.4375 L 21.28125 14.71875 A 1.016466 1.016466 0 1 0 22.71875 13.28125 L 21.75 12.3125 L 23.40625 10.6875 C 25.366628 8.727122 25.564583 5.6795387 24.03125 3.40625 L 25.71875 1.71875 A 1.0001 1.0001 0 0 0 24.875 0 z M 3.90625 10.96875 A 1.0001 1.0001 0 0 0 3.78125 11 A 1.0001 1.0001 0 0 0 3.28125 12.71875 L 4.25 13.6875 L 2.59375 15.3125 C 0.63337202 17.272878 0.43541722 20.320461 1.96875 22.59375 L 0.28125 24.28125 A 1.016466 1.016466 0 1 0 1.71875 25.71875 L 3.375 24.0625 C 5.5789499 25.653602 8.636362 25.368208 10.6875 23.40625 C 10.6875 23.32988 11.542705 22.496496 12.3125 21.75 L 13.28125 22.71875 A 1.016466 1.016466 0 1 0 14.71875 21.28125 L 4.71875 11.28125 A 1.0001 1.0001 0 0 0 3.90625 10.96875 z" />
				</svg>
			</span> : <></>}
		</Fab>
	);
}

export default WalletButton

