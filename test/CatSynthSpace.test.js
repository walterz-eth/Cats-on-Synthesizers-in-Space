const CatSynthSpace = artifacts.require ("CatSynthSpace");
const truffleAssert = require ("truffle-assertions");

contract ("CatSynthSpace",(accounts) => {
    it("Should mint a token and send to expected account", async () => {
        const instance = await CatSynthSpace.deployed();
        let txResult = await instance.safeMint (accounts[1], "0");
        
        //console.log (txResult);
        //console.log (accounts[1]);

        // Beware that JS uint max size is 2^53, not enough to represent Solidity's uint256
        // BN library comes in hand to overcome this
        truffleAssert.eventEmitted (txResult, "Transfer", {to: accounts[1], tokenId: web3.utils.toBN(0)}); // Warning with uint256 values!

        assert.equal (await instance.ownerOf(0), accounts[1], "Owner of token is not the expected");

        //console.log(await instance.tokenURI(web3.utils.toBN(0)));
        
        const tx = await instance.buyToken({ sender: accounts[1], value: web3.utils.toWei("0.1", "ether") });
        
    })
});
