import React from 'react'
import './Main.css'
import {resolvePath, useNavigate } from 'react-router-dom';
import Header  from './Header';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { PlayFab , PlayFabClient } from 'playfab-sdk';
import { injected } from '../contracts'
// import {PlayFab} from 'https://download.playfab.com/PlayFabClientApi.js';
import {PlayFabClient_,setPlayFabclient} from './PlayfabClient';

const Landing = () =>{
    const navigate = useNavigate();
    const check = "";
    const { account, active, activate, chainId, deactivate } = useWeb3React();

    const connectWallet = async() => {
        await activate(injected);
    }

    useEffect(() => {
        connectWallet()
    }, [])

    useEffect(() => {
        if(active){
            PlayFab.settings.titleId = "1C79C";
            const loginRequest = {
                // Currently, you need to look up the correct format for this object in the API-docs:
                // https://api.playfab.com/Documentation/Client/method/LoginWithCustomID
                TitleId: PlayFab.settings.titleId,
                CustomId: account,
                CreateAccount: true
            };
            PlayFabClient.LoginWithCustomID(loginRequest,async(err,result) => {
                if(result !== {}){
                    await setPlayFabclient(result);
                    console.log(PlayFabClient_);
                } else if(err !== {}) {
                    console.log(err);
                }
                
                console.log(PlayFab.settings.titleId);
                navigate("/connect");
            })
            
        }
    }, [active])

    return(
        <div className="body">
            <Header check={check}/>
            <div className="main flex-container">
                <button onClick={() => connectWallet()} className='font-2 button-width-50 border-radius-10 button-height-8 connect-button-background border-none text-white flex-container' >
                    Connect Wallet
                </button>
            </div>
        </div>
    )
}

export default Landing;