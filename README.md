<p align="center"><a target="_blank" href="https://3tix.github.io/event-management/"><img src="logo.png" alt="3TIX" width="600"/></a></p>

<p align="center">Application URL: https://3tix.github.io/event-management/</p>
<p align="center">DevPost showcase URL: https://devpost.com/software/3tix-b1rkvn/</p>
<p align="center">HackFS 2022 showcase URL: https://ethglobal.com/showcase/3tix-r2ivv/</p>

##### Table of Contents
- [Description](#description)
    * [How to use](#how-to-use)
- [Architecture and used dependencies](#architecture-and-used-dependencies)
    * [Current state](#current-state)
    * [Potential further improvements](#potential-further-improvements)

## Description
Create, sell, buy tickets on-chain.

Whether in the Metaverse or on planet earth, 3TIX makes it easy to manage tickets for any event.

**3TIX** platform helps events organizers to create and sell event tickets in form of NFT. All the event data are stored on IPFS and compatible with ERC721 metadata format, so bought tickets can be easily re-sold on NFT marketplaces like OpenSea, LooksRare, etc. Created NFTs are also compatible with ERC2981 format, so creators of the event can receive royalties from secondary sales of tickets, which is one of the biggest problems in web2 for the ticketing industry.

### How to use
* Go to the app https://3tix.github.io/event-management/
* Use any of the features:
  * Create event
  * Buy ticket
  * Claim QR code

## Architecture and used dependencies
### Current state
* Smart contract deployed and tested on [Polygon](https://polygon.technology/) [Mumbai](https://mumbai.polygonscan.com/address/0x16a51748274cd17fe9de674e44654ff68efd3936)
* All the data for the events and **NFT** details are published to [IPFS](https://ipfs.io/) ([Example](https://bafkreihtgcppnqygiwxkny44kfp4raiz7o6dvmrkzzx4kgc5kksnytpgsy.ipfs.nftstorage.link)) via **nft.storage**
* We are utilizing [The Graph](https://thegraph.com/en/) protocol to index on-chain and **IPFS** event data.
* [Covalent](https://www.covalenthq.com/) helps us get the **NFTs** owned by the user, so the user can burn the **NFT** to get a QR code ticket.
* DApp frontend is also deployed to **IPFS**. [older IPFS deployment](https://bafybeibh2k4ehwoomaiomqbmrvybaedy2xpvp6mpahg5jz3o6rbjtt6dxi.ipfs.nftstorage.link/)
* Our Backend deployed to **AWS**.
* [POAP](https://poap.xyz/) to be distributed after the event

### Potential further improvements
* Enhance UI/UX: edit events, better ticket and event management features
* Make a mobile app to manage your tickets
* Make a mobile app for event orginisers (manage event and validate tickets for on-site event for example)