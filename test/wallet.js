var wallet = artifacts.require("./MyWallet.sol");




contract("MyWallet", function(accounts) {
    it('should be possible to put money inside', function() {
       var contractInstance;
        return wallet.deployed().then(function(instance) {
            console.log(instance.address)
            contractInstance = instance;
            return contractInstance.sendTransaction({value: web3.utils.toWei('10', 'ether'), address:contractInstance.address, from: accounts[0]});
        }).then(function(results) {
            web3.eth.getBalance(contractInstance.address).then(function(value){
                assert.equal(value, web3.utils.toWei('10', 'ether'), 'The Balance is the same');
            })
        });
    });

    it('should be possible to get money back as the owner', function() {
        var walletInstance;
        var balanceBeforeSend;
        var balanceAfterSend;
        var amountToSend = web3.utils.toWei('5', 'ether');
        return wallet.deployed().then(function(instance) {
            walletInstance = instance;
            balanceBeforeSend = web3.eth.getBalance(instance.address).toNumber();
            return walletInstance.spendMoneyOn(accounts[0], amountToSend, "Because I'm the owner", {from: accounts[0]});
        }).then(function() {
            return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance) {
            balanceAfterSend = balance;
            assert.equal(balanceBeforeSend - amountToSend, balanceAfterSend, 'Balance is now 5 ether less than before');
        });
    });

    // it('should be possible to propose and confirm spending money', function() {
    //     var walletInstance;
    //     return wallet.deployed().then(function(instance) {
    //         walletInstance = instance;
    //         return walletInstance.spendMoneyOn(accounts[1], web3.utils.toWei('5','ether'), "Because I need money", {from: accounts[1]});
    //     }).then(function() {
    //         assert.equal(web3.eth.getBalance(walletInstance.address).toNumber(), web3.utils.toWei('5', 'ether'), 'Balance is now 5 ether less than before');
    //     });
    // });

});


// TESTING IN TRUFFLE DEV:
// var instance;
// MyWallet.deployed().then(function(inst){instance = inst});
// web3.eth.getBalance(instance.address)


