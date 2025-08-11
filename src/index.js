import axios from "axios";
import * as queryMap from "./querymap.json";



async function form1(){
    window.open("https://form.jotform.com/252172180330041", "_blank");
}
window.form1 = form1;


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
        const qry = userInput.slice(2, userInput.length);
        const normalizedQuery = queryMap[qry] || "faulty query";
        if (normalizedQuery == 'what is somnia?'){
            return "Somnia is an EVM based layer 1 blockchain. It is noted for its fast speed.";
        }
        else if (normalizedQuery == 'what are some good wallets for somnia?'){
            return "It is highly recommended that you use the MetaMask or Coinbase wallets for Somnia."
        }
        else if (normalizedQuery == 'where can i stake on somnia?'){
            return "Somnia is currently in the testnet phase so this might not be a good time for it."
        }
        else {
            return 'looks like this is an info query: '.concat(normalizedQuery).concat(" But it returned no results.");
        }

    }
    else if (typeOfInput == 2){
        const qry = userInput.slice(3, userInput.length);
        return "looks like this is a transaction query: ".concat(qry);
    }
    else if (typeOfInput == 3){
        const qry = userInput.slice(13, userInput.length);
        return "looks like this is an AI request: ".concat(qry);
    }
    else if (typeOfInput == 4){
        return "looks like your query isn't properly formatted.";
    }
    else {
        return "what the fuck is going on!?";
    }
    return "undefined error.";
}
window.getBotResponse = getBotResponse
