import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3";
import * as queryMap from "./querymap.json";
import * as responseMap from "./responsemap.json";



async function connectOrDisconnect() {
    const acc_cur = localStorage.getItem("acc") || "";
    console.log(acc_cur);
    if (acc_cur != "" && acc_cur != null){
        localStorage.setItem("acc","");
        document.getElementById("log_status").textContent = "Login";
        return;
    }

    var chainId = 50312;
    var cid = '0xc488';
    var chain = 'Somnia Testnet';
    var name = 'SOMNIA';
    var symbol = 'STT';
    var rpc = "https://dream-rpc.somnia.network";

    const provider = await detectEthereumProvider()
    console.log(window.ethereum);
    if (provider && provider === window.ethereum) {
        console.log("MetaMask is available!");

        console.log(window.ethereum.networkVersion);
        if (window.ethereum.networkVersion !== chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: cid }]
                });
                console.log("changed to ".concat(name).concat(" testnet successfully"));

            } catch (err) {
                console.log(err);
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    console.log("please add ".concat(name).concat(" Testnet as a network"));
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainName: chain,
                                    chainId: cid,
                                    nativeCurrency: { name: name, decimals: 18, symbol: symbol },
                                    rpcUrls: [rpc]
                                }
                            ]
                        });
                }
                else {
                    console.log(err);
                }
            }
        }
        await startApp(provider);
    } else {
        console.log("Please install MetaMask!")
    }



}
window.connectOrDisconnect = connectOrDisconnect;


async function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
  else {
    const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    })
    console.log("hi");
  const account = accounts[0];
  var web3 = new Web3(window.ethereum);
  const bal = await web3.eth.getBalance(account);
  //console.log("hi");
  console.log(bal);
  console.log(account);
  localStorage.setItem("acc",account.toString());
  document.getElementById("log_status").textContent = (account.toString().slice(0,8)).concat('..(Logout)');

  }
}



async function form1(){
    window.open("https://form.jotform.com/252172180330041", "_blank");
}
window.form1 = form1;

async function createHtmlResponse(text){
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const text1 = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    const lineRegex = /[\r\n]/g;
    return text1.replace(lineRegex, '<br/>');
}
window.createHtmlResponse = createHtmlResponse;


async function getBotResponse(userInput){
    var typeOfInput = 0;
    if (userInput.slice(0,2) == 'i:'){
        typeOfInput = 1;
    }
    else if (userInput.slice(0,3) == 'tx:'){
        typeOfInput = 2;
    }
    else if (userInput.slice(0,13) == '123412341234:'){
        typeOfInput = 3;
    }
    else {
        typeOfInput = 4;
    }

    if (typeOfInput == 1){
        const qry1 = userInput.slice(2, userInput.length);
        const qry = qry1.trim();
        const normalizedQuery = queryMap[qry] || "faulty query";
        const normalizedResponse = responseMap[normalizedQuery] || "no response";
        console.log(normalizedQuery);
        if (normalizedResponse == 'no response'){
            return "Looks like this query doesn't match anything in our cached query list. Please go through our docs and use one of the supported queries, or use a custom query if you can't find a similar query.";
        }
        else {
            return normalizedResponse;
        }

    }
    else if (typeOfInput == 2){
        const qry1 = userInput.slice(3, userInput.length);
        const qry = qry1.trim();
        const regex = /^send\s+(\d+)\s+tokens\s+to\s+(.*)$/;
        const match = qry.match(regex);
        if (match){
            const amt = match[1];
            const recipient = match[2];
            return "sending ".concat(amt).concat(" to ").concat(recipient).concat(".");
        }
        else {
            return "looks like this is transaction query isn't correctly formatted: ".concat(qry);
        }

    }
    else if (typeOfInput == 3){
        const qry = userInput.slice(13, userInput.length);
        return "looks like this is an AI request: ".concat(qry);
    }
    else if (typeOfInput == 4){
        return "Looks like your query isn't properly formatted. Please make sure it starts with either 'i:' for info queries, 'tx:' for transaction queries, and '<key>:' where key is your 12 digit Awesom AI secret key for custom queries.";
    }
    else {
        return "what the fuck is going on!?";
    }
    return "undefined error.";
}
window.getBotResponse = getBotResponse;

function shuffleArray(arr){
    for (let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function getQuerySuggestions(text){
    const matches = Object.keys(queryMap)
                                .filter(query => query.toLowerCase().includes(text) && (query[query.length - 1] == '.' || query[query.length - 1] == '?' || query[query.length - 1] == '!'));
    const shuffledMatches = shuffleArray(matches);

    return shuffledMatches;
}
window.getQuerySuggestions = getQuerySuggestions;
