const enableMetaMaskButton = document.querySelector('.enableMetamask');
const mintButton = document.querySelector('.doMint');
const uriButton = document.querySelector('.doGetURI');

const contractAddr = document.querySelector('#address');
const contractAbi = document.querySelector('#abi');
const tokenId = document.querySelector('#tokenId');

const statusText = document.querySelector('.statusText');
const eventResult = document.querySelector('.eventResult');

enableMetaMaskButton.addEventListener('click', () => {
  enableDapp();
});

mintButton.addEventListener('click', () => {
  if (contractAddr.value != "" && tokenId.value != "" ) {
    listenToEvents();
    mint();
  }else {
    statusText.innerHTML = "Contract address missing or tokenId missing."
  }
});

uriButton.addEventListener('click', () => {
  getNewTokenURI();
});

let accounts;
let web3;

async function enableDapp() {

  console.log (abi);

  if (typeof window.ethereum !== 'undefined') {
    try {
      accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      web3 = new Web3(window.ethereum);
      statusText.innerHTML = "Account: " + accounts[0];

      contractAddr.removeAttribute("disabled");
      tokenId.removeAttribute("disabled");
      
      // abi constant is defined in static/js/abi.js, generated automatically on app startup (server.js)
      // contractAbi.removeAttribute("disabled");
      contractAbi.innerHTML = JSON.stringify(abi);

    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 the user rejected the transaction
        statusText.innerHTML = "Error: Need permission to access MetaMAsk";
        console.log('Permissions needed to continue.');
      } else {
        console.error(error.message);
      }
    }
  } else {
    statusText.innerHTML = "Error: Need to install MetaMask";
  }
};


async function listenToEvents() {
  
  let contractInstance = new web3.eth.Contract(abi, contractAddr.value);
  
  // LISTEN for events
  contractInstance.events.Transfer().on("data", (event) => {
  	eventResult.innerHTML = "NEW EVENT data received: " + "<br/>" + JSON.stringify(event) + "<br />=====<br />" + eventResult.innerHTML;
  });
}

async function mint () {
  let contractInstance = new web3.eth.Contract(abi, contractAddr.value);

  contractInstance.methods.safeMint(accounts[0], tokenId.value).send({from: accounts[0]})
  .on('transactionHash', function(hash){
  })
  .on('confirmation', function(confirmationNumber, receipt){
  })
  .on('receipt', function(receipt){
    // receipt example
    console.log(receipt);
  })
  .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    console.log (error);
  });
}

async function getNewTokenURI () {
  let contractInstance = new web3.eth.Contract(abi, contractAddr.value);
  
  contractInstance.methods.tokenURI(tokenId.value).call()
  .then(function(returnData){
    eventResult.innerHTML = "New Token URI: " +returnData+ "<br /><br />=====<br /><br />" + eventResult.innerHTML;
  });
}