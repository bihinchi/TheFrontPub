

# svelte app

An app for decentralized publications that uses [Ethereum](https://ethereum.org/en/what-is-ethereum/) as a backend.
Supported types of publications are a simple link, an image, a video or an iframe to another site. 

## Installing locally

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

### Deploying contract

You can deploy the smart contract of the dapp to a blockchain listening locally on a port 7545 by:
```bash
node src/js/deploy.js
```
The script will output an address of the deployed contract. Add it to the 'networks' object  in src/js/app.js under  a key 1337.


