

# TheFrontPub

<img src="https://gateway.pinata.cloud/ipfs/QmXzUiiyMBxa8e5sH18KLSgvxFsfD9GrHyRRFAuq3h3AJz" width="320" height="180" alt="Demo gif" align="right"/>

An app for decentralized publications that uses [Ethereum](https://ethereum.org/en/what-is-ethereum/) as a backend.
Supported types of publications are a simple link, an image, a video or an iframe to another site. 

[Metamask](https://metamask.io) or any other extension that injects an 'ethereum' object to browsers is required for making a publication.

### Rules:

- Invested Eth creates a score for a publication that affect the time it is shown on the front page.
- Being on the front page decreases the score.
- The duration on the front page is calculated by a quadratic function. 0.05 Eth is equal to an hour and 1 Eth to a day. 
- The minimum time for a publication on the front page before it switches to a publication with a bigger score is 15 minutes, except when score drops to 0.

### Disclaimer:

Due to decentralized nature of the app, it is extremely difficult for filtering out malicious, harmful or innapropriate content. The creator of the app isn't responsible for any publication except his own nor for damage caused by them. Install a secure browser, update it to the latest version and proceed on your own risk. 


## Installing locally:

Installation using [npm](https://www.npmjs.com):

```bash
npm install
```

start the development version using [Rollup](https://rollupjs.org):

```bash
npm run dev
```

and production mode with

```bash
npm run build
```

You should see the dapp running on [localhost:5000](http://localhost:5000). 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0` or manually set an envieromental variable with the same name and value.

### Deploying the contract:

You can deploy the smart contract of the dapp to a blockchain listening locally on a port 7545 by:
```bash
node src/js/deploy.js
```
The script will output an address of the deployed contract. Add it to the 'networks' object  in src/js/app.js under  a key 1337.


