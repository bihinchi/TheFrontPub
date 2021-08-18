const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');


// compile:

const params = {
    language: "Solidity",
    sources: {
        "contract": {
            content: fs.readFileSync("../contracts/Publication.sol", 'utf-8')
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"]
            }
        }
    }
};


const compileCode = JSON.parse(solc.compile(JSON.stringify(params)));

const contract = compileCode.contracts.contract.Publication

const abi = contract.abi;
const byteCode = contract.evm.bytecode.object;

fs.writeFileSync("../contracts/build/Publication.json", JSON.stringify(contract));




// deploy

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));





const deploy = async () => {

    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(abi)
        .deploy({
            data: byteCode
        })
        .send({from: accounts[0], gas: "1000000"});

    console.log("contract address: ", result.options.address);
};


deploy();