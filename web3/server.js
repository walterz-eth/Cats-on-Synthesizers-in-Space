const fs = require('fs');

const express = require('express')
const app = express()
const port = 3000

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/

app.use(express.static('./web3'))

app.listen(port, () => {
  console.log(`Minting app running on port ${port}`)
})

/*
  TODO:
  automatically inject abi to webpage
*/

let rawdata = fs.readFileSync('./build/contracts/CatSynthSpace.json');
let abi = JSON.parse(rawdata).abi;
//console.log("Contract's ABI: " + JSON.stringify(abi));

fs.writeFile("./web3/static/js/abi.js", "const abi = " + JSON.stringify(abi) + ";", function(err) {
  if(err) {
      return console.log(err);
  }
  console.log("Abi file saved");
}); 