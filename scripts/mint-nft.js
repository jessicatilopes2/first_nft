require('dotenv').config();
const { API_URL,PUBLIC_KEY, PRIVATE_KEY} = process.env;
const { createAlchemyWeb3 } = require( '@alch/alchemy-web3');
const web3 = createAlchemyWeb3(API_URL);

const contract = require('../artifacts/contracts/MyNFT.sol/MyNFT.json');

const contractAddress = (`${PUBLIC_KEY}`);
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    const tx = {
        'from': PUBLIC_KEY,
        'nonce': nonce,
        'gas': 50000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI)
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, `0x${PRIVATE_KEY}`);

    signPromise.then( (signed) => {
        web3.eth.sendSignedTransaction(signed.rawTransaction, (err, hash) => {
            if (!err){
                console.log( `O Hash da transação é: ${hash}`);
            } else {
                console.log(`Ocorreu um erro ${err}`);
            }
        });
    }) 
    .catch((err)=> {
        console.log(`Problema com a transação ${err}`);
    })
}
mintNFT("ipfs://0x4cd5e737d1ad509573f6924465168e54417f013e")