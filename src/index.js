import axios from "axios";
import * as queryMap from "./querymap.json";
import * as responseMap from "./responsemap.json";



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
window.getBotResponse = getBotResponse
