import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import "./Main.css";
import ToggleButton from "./ToggleButton";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  supportChainId,
  // portalContract
  providers,
  Contrats,
} from "../contracts";

import { PlayFab, PlayFabClient, PlayFabAdmin, PlayFabServer } from "playfab-sdk";

import {PlayFabClient_,setPlayFabclient} from './PlayfabClient';

const secretKey = process.env.REACT_APP_SECRET_KEY_PLAY_FAB;
const Connect = () => {
  const navigate = useNavigate();
  // const walletvalues = useRef(0);
  const gamevalues = useRef(0);
  const [walletvalues, setWalletvalues] = useState("");
  const [gameValueTest, setGameValueTest] = useState("");
  const [transferType, setTransferType] = useState("Deposit");
  const [walletBalance, setBalance] = useState(0);
  const [gameBalance, setGameBalance] = useState(0);
  const { account, active } = useWeb3React();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const portalContract = new ethers.Contract(
    Contrats.portalcontract.address,
    Contrats.portalcontract.abi,
    signer
  );

  const getWalletBalance = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance_ = await provider.getBalance(accounts[0]);
    setBalance(ethers.utils.formatEther(balance_));
  };

  const getGameBalance = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance_ = await portalContract.isDeposit(accounts[0]);
    setGameBalance(ethers.utils.formatEther(balance_));
    setGameValueTest(ethers.utils.formatEther(balance_));
    
    PlayFabClient.ExecuteCloudScript({FunctionName: "GetVC"},(err,result) => {
      if(result !== ""){
        console.log(result);
      } else if(err !== ""){
        console.log(err);
      }
    } )
  }
  useEffect(() => {
    console.log('start = ', PlayFabClient_);
    if(PlayFabClient_.data !== undefined){
      getGameBalance();
      console.log('end = ', PlayFabClient_);
    }
    getWalletBalance();
  },[]);

  useEffect(() => {
    if (!active) {
      navigate("/");
    } else {
        //setPlayFabClient_(PlayFabClient_.data.PlayFabId);
        if(!PlayFabClient_)
          console.log(PlayFabClient_);
    }
  }, [active]);

  const changeTransferType = () => {
    if (transferType === "Deposit") setTransferType("WithDraw");
    else setTransferType("Deposit");
  };

  const DepositClick = async () => {
    const depositVaule = walletvalues;
    if (Number(depositVaule) !== NaN) {
      const transaction = await portalContract.deposit({
        value: ethers.utils.parseEther(depositVaule),
      });
      await transaction.wait();
  
      const DepositVCRequest = {
        Amount: depositVaule,
        WalletAddress : account
      };
      
      PlayFabClient.ExecuteCloudScript({FunctionName: "DepositVC",FunctionParameter: DepositVCRequest},
      (err , result) => {
        if(result !== ""){
          console.log(result);
        } else if(err !== ""){
          console.log(err);
        }
      })
    }
  };

  
  const WithDrawClick = async () => {
    const gameVaule = gamevalues.current.value;
    //console.log(depositVaule);
    if (Number(gameVaule) !== NaN) {
      console.log(gameVaule);

      const transaction = await portalContract.withDraw(
        ethers.utils.parseEther(gameVaule)
        );
        await transaction.wait();
    
      const WithdrawVCRequest = {
        Amount: gameVaule,
        WalletAddress : account
      };
      
      PlayFabClient.ExecuteCloudScript({FunctionName: "WithdrawVC",FunctionParameter: WithdrawVCRequest},
      (err , result) => {
        if(result !== ""){
          console.log(result);
        } else if(err !== ""){
          console.log(err);
        }
      })
    }
  };

  const onWalletChange = async (e) => {
    setWalletvalues(e.target.value);
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance_ = await portalContract.isDeposit(accounts[0]);
    let balance = Number(ethers.utils.formatEther(balance_));
    balance += Number(e.target.value);
    setGameValueTest(balance);
  };

  const WithDrawScreen = () => (
    <div>
      <div className="row mt-20">
        <div className="col-4">
          <p className="text-white">
            <strong>Game Balance:{gameBalance}</strong>
          </p>
          <input
            className="form-control form-control-lg background-dark text-white"
            type="text"
            ref={gamevalues}
            placeholder="0.0"
          />
        </div>
        <div className="col-6">
          <p className="text-white">
            <strong>Wallet Balance:{walletBalance}</strong>
          </p>
          <input
            className="form-control form-control-lg background-dark text-white"
            type="text"
            placeholder="0.0"
            value={walletBalance}
            readOnly
          />
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={WithDrawClick}
          className="m-auto font-2 button-width-80 border-radius-10 button-height-8 connect-button-background border-none text-white flex-container"
        >
          WithDraw
        </button>
      </div>
    </div>
  );

  return (
    <div className="body">
      <Header check={transferType} />
      <div className="container">
        <label className="text-white mr-3">Deposit</label>
        <ToggleButton check={changeTransferType} />
        <label className="text-white">WithDraw</label>
        {transferType === "Deposit" ? (
          <div>
            <div className="row mt-20">
              <div className="col-6">
                <p className="text-white">
                  <strong>Wallet Balance:{walletBalance}</strong>
                </p>
                <input
                  className="form-control form-control-lg background-dark text-white"
                  type="text"
                  placeholder="0.0"
                  //ref={walletvalues}
                  value={walletvalues}
                  name="inputWalletValue"
                  onChange={onWalletChange}
                />
              </div>
              <div className="col-4">
                <p className="text-white">
                  <strong>Game Balance:{gameBalance}</strong>
                </p>
                <input
                  className="form-control form-control-lg background-dark text-white"
                  type="text"
                  placeholder="0.0"
                  key={gameValueTest}
                  value={gameValueTest}
                  readOnly
                />
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={DepositClick}
                className="m-auto font-2 button-width-80 border-radius-10 button-height-8 connect-button-background border-none text-white flex-container"
              >
                Deposit
              </button>
            </div>
          </div>
        ) : (
          <WithDrawScreen />
        )}
        <div className="mt-3">
          <p className="text-white pl-20 background-darkgray border-radius-10">
            Use this portal to depositand withdraw game coins
            <br />
            There is a maximum withdrawal amount of 1000 coins perday
            <br />
            <br />
            Game coins will automatically appear in your game wallet.
            <br />
            The ratio is set 1:1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connect;
