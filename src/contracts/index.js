import { ethers } from "ethers";

import Contrats from "./contract.json";
import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const supportChainId = 1666600000;

const RPCS = {
    1666600000: "https://api.harmony.one/",
}

const providers = {
    1666600000: new ethers.providers.JsonRpcProvider(RPCS[1666600000]),
    // 417: new ethers.providers.JsonRpcProvider(RPCS[417]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337])
}

const injected = new InjectedConnector({
    supportedChainIds: [1, 56, 137, 43114, 250, 66, 10, 42161, 97, 65, 80001, 43113, 4002, 65, 4, 1666600000],
});

// export const walletconnect = new WalletConnectConnector({
//     rpc: { 1: RPC_URL },
//     bridge: "https://bridge.walletconnect.org",
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// });


// const portalContract = new ethers.Contract(Contrats.portalcontract.address, Contrats.portalcontract.abi, providers[supportChainId]);

export {
    supportChainId,
    // portalContract,
    providers,
    Contrats,
    injected
}