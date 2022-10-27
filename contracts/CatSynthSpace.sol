// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@ganache/console.log/console.sol";
//import "hardhat/console.sol"; // for hardhat workspaces

contract CatSynthSpace is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CatSynthSpace", "CATSSS") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://bafybeieizgytmfr2nmk2disdthkvmtke4pn2jul7ztt5aybob32o6zfsaq.ipfs.nftstorage.link/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Used to buy the next available token
     * @dev We will simulate price fluctuations by setting price related to current tokenId available.
     */
    function buyToken () external payable {        
        uint256 tokenId = _tokenIdCounter.current();

        // We have to log while transaction is running, so not possible to log anything AFTER the require statements.
        // REMEMBER this logs will appear on ganache console/log files, not truffle's!
        console.log (tokenId, msg.value);

        require (msg.value == tokenId * 0.1 ether, "Not enough ETH to buy a token");

        _tokenIdCounter.increment(); // for later use
        _safeMint (msg.sender, tokenId);
    }
}
