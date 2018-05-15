const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount
    }
}

class Block{
    constructor(timestamp, transations, previousHash = ''){
        this.timestamp = timestamp;
        this.transations = transations;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        // The nonce variable enables repeated hashing in mineBlock()
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transations) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty){
        // added difficulty to inplement the proof-of-work feature in a peer-to-peer system
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join('0')){
            this.nonce += 1;
            this.hash = this.calculateHash()
        }

        console.log('Block Mined: ' + this.hash)
    }

}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block('2018/01/01', [], 'genesis');
    }

    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLastBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block Mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transation){
        this.pendingTransactions.push(transation);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for (const block of this.chain){
            for(const trans of block.transations){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.block[i];
            const previousBlock = this.block[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        
        return true;
    }
}

let wilsonCoin = new BlockChain();
wilsonCoin.createTransaction(new Transaction('address1', 'address2', 50))
wilsonCoin.createTransaction(new Transaction('address2', 'address1', 10))

console.log('Start the miner...\n')

wilsonCoin.minePendingTransactions('wilson-address')

/*
    After the first minePendingTransaction, the miningReward will be in the pendingTransaction,
    We need to run the miner one more time to show the preivous balance.
*/
console.log('Balance of the wilson address is: ', wilsonCoin.getBalanceOfAddress('wilson-address'))

console.log('Start the miner again...\n')

wilsonCoin.minePendingTransactions('wilson-address')

console.log('Balance of the wilson address is: ', wilsonCoin.getBalanceOfAddress('wilson-address'))
/*
    The mining reward from the second minePendingTransactions is in the pendingTransaction and will
 */