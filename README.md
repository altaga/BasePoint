# BasePoint

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [<img src="https://img.shields.io/badge/View-Video-red">](https://youtu.be/rn2Sn4idjuI)

<img src="https://i.ibb.co/3zptyjD/logo-con-letras-azules.png" width="50%">

Welcome, this is our project for Superhack Hackathon - ETH Global.

# IMPORTANT!

## Application:

POS App APK: [LINK](./BasePointAPK/app-release.apk)

## Here is our main demo video:

[![Demo](https://i.ibb.co/g4W3ypx/image.png)](https://youtu.be/rn2Sn4idjuI)

# Introduction and Problem

Basepoint is perhaps the first built on Base, Optimism-powered, Superchain enabled Point of Sale platform for retail and businesses.

When we were deciding on what to hack for the superhack we asked ourselves…

Have we really Banked the unbanked and reached the final consumer in our Web3 Applications?

Or, are we just feeding developers and speculators?

And that’s the main issue with Web3 at this moment. 

But, if we take a look at the state of the technology even one year ago, we could not focus on anything else as the fees and the networks at that time were not really there.

Now the technology is there with rollups, AI and the Superchain enabling us to reach more.


# Solution

BasePoint is a Base and Optimism-powered, Superchain and Layer Zero enabled Point of Sale platform for retail and businesses.

System's Architecture:

<img src="https://i.ibb.co/DpLhXnV/Scheme-drawio-1.png">

- All Base and Cross-chain transactions are controlled through [web3.js](https://web3js.readthedocs.io/en/v1.8.0/), [Ethers](https://docs.ethers.org/v5/) and [WalletConnectV2](https://walletconnect.com/) on mainnet.

- Through Rapyd's APIs we can manage users, checkout, swap and KYC of our app. (https://www.rapyd.net/)

- Wallet Connect is used as a secure connection to transmit the Point of Sale transactions to the Wallet, this connection is similar to a WebSocketSecure method and is widely adopted in EVM wallets.

- ChainLink is used for its price feeds for each of the most popular assets in the cryptocurrency market.

- [Stargate.finance](https://stargate.finance/) is the bridging on-chain service, powered by [LayerZero](https://layerzero.network/) that we use to make transactions across chains. All these transactions can be seen on the LayerZero explorer.

The transaction we do in the demo video is as follows.

https://layerzeroscan.com/184/address/0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398/message/111/address/0x701a95707a0290ac8b90b3719e8ee5b210360883/nonce/12853

# Layer Zero - Cross-chain Transfers:

<img src="https://i.ibb.co/RYmgrF3/image.png" width="33%">

For all transactions that require transfers from one chain to another we use the [Stargate Router Solidity Interface](https://stargateprotocol.gitbook.io/stargate/). To improve the payment experience and make simple transactions with a mobile wallet, we used [WalletConnectV2](https://walletconnect.com/).

<img src="https://i.ibb.co/dfJv1S6/Screenshot-20230812-170711.png" width="32%"> <img src="https://i.ibb.co/1ZZyfRF/Screenshot-20230812-170716.png" width="32%"> <img src="https://i.ibb.co/tc71fpH/Screenshot-20230812-170723.png" width="32%">

The implementation code for our app is the following:

[CODE](./BasePoint/src/screens/walletConnectComp.js)

    // Stargate
    const router = new ethers.Contract(
        stargateContract,
        abiStargate,
        provider,
    );
    const quoteData = await router.quoteLayerZeroFee(
        this.state.network.stargateID, // destination chainId
        1, // function type: see Bridge.sol for all types
        to, // destination of tokens
        '0x', // payload, using abi.encode()
        {
            dstGasForCall: 0, // extra gas, if calling smart contract,
            dstNativeAmount: 0, // amount of dust dropped in destination wallet
            dstNativeAddr: '0x', // destination wallet for dust
        },
    );
    transaction = await router.populateTransaction.swap(
        this.state.network.stargateID, // destination chainId
        this.state.token.stargateID, // source poolId
        stargatePoolPairs[this.state.token.indexToken][
            this.state.network.networkSelected
        ], // destination
        from, // refund address. extra gas (if any) is returned to this address
        amount, // quantity to swap
        0, // the min qty you would accept on the destination
        {dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: '0x'},
        to, // the address to send the tokens to on the destination
        '0x', // payload
    );

Since this stargate protocol is a DeFi protocol and the bridges are made through transactions through pair pools, before making a crosschain transaction we have to make sure that the pair exists in it. That is why it is preferable to make payments using stablecoins such as USDC, since USDC pairs exist in all networks. The app will tell you if the pair does not exist.

<img src="https://i.ibb.co/TPX73RT/Screenshot-20230812-165810.png" width="33%"> <img src="https://i.ibb.co/Qkhmdkr/Screenshot-20230812-165816.png" width="33%">

# Covalent - Balances and Transfers.

<img src="https://i.ibb.co/8cXDrqq/image.png" width="33%">

All the balances and transaction history that we obtain in the app are directly from the Covalent API, this in order to obtain a quick update of these and keep the app scalable over time when we have a large volume of users.

<img src="https://i.ibb.co/RBqqSgM/Screenshot-20230812-170915.png" width="32%"> <img src="https://i.ibb.co/1MzcJ2v/Screenshot-20230812-170920.png" width="32%">

The code section to obtain the general balances is the following.

[CODE](./BasePoint/src/screens/cryptoAccount.js)

    async getBalances() {
        return new Promise(async (resolve, reject) => {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Basic ${btoa(covalentKey)}`);
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            };
            fetch(
            `https://api.covalenthq.com/v1/${
                NODE_ENV_NETWORKS[this.context.value.networkSelected].covalentID
            }/address/${this.context.value.account}/balances_v2/?`,
            requestOptions,
            )
            .then(response => response.json())
            .then(result => resolve(result.data.items))
            .catch(error => reject([]));
        });
    }

The code section to obtain the list of general transactions is the following:

[CODE](./BasePoint/src/screens/cryptoAccountComponents/cryptoMainTransactions.js)

    getTransactions() {
        return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Basic ${btoa(covalentKey)}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };
        fetch(
            `https://api.covalenthq.com/v1/${
            NODE_ENV_NETWORKS[this.context.value.networkSelected].covalentID
            }/address/${this.context.value.account}/transactions_v3/?`,
            requestOptions,
        )
            .then(response => response.json())
            .then(result => resolve(result.data.items))
            .catch(error => reject([]));
        });
    }

# Base -  Point of Sale application:

<img src="https://i.ibb.co/GxzwwNB/image.png" width="33%">

The Point of Sale application is focused on the simple reception of payments and an interface focused on generating payment orders through QR.

<img src="https://i.ibb.co/jTYK6ZG/Screenshot-20230812-171346.png" width="32%">

- The POS allows us to see the Crypto and Fiat balances received along with the list of transactions just like the Main App.

  <img src="https://i.ibb.co/RBqqSgM/Screenshot-20230812-170915.png" width="32%">
  <img src="https://i.ibb.co/1MzcJ2v/Screenshot-20230812-170920.png" width="32%">
  <img src="https://i.ibb.co/VQ9z9DL/Screenshot-20230812-170930.png" width="32%" >

- This is a screenshot of our backend in Rapyd, this is a sample of how we are managing Fiat in the POS.

  <img src="https://i.ibb.co/vXD3Hzf/image.png">

- One of the most important processes is being able to make payments at the POS through [WalletConnectV2](https://walletconnect.com/), being this the pillar of our device. We will have to select the origin network that will make the transfer and later the token that will be used to pay, in this case we have compatibility with all the pairs available in [Stargate.finance](https://stargate.finance/), we recommend USDC.

    <img src="https://i.ibb.co/tHxvD6D/Screenshot-20230812-171509.png" width="32%"> 
    <img src="https://i.ibb.co/5jgXWC2/Screenshot-20230812-171513.png" width="32%"> 

- When the reference is created by QR, it can be paid through any wallet compatible with [WalletConnectV2](https://walletconnect.com/). Once the reference payment has been made, we will be able to see the confirmed and verified messages.


    <img src="https://i.ibb.co/tc71fpH/Screenshot-20230812-170723.png" width="32%">
    <img src="https://i.ibb.co/SmxSpk8/Screenshot-20230812-170748.png" width="32%">
    <img src="https://i.ibb.co/GPJHMxb/Screenshot-20230812-170902.png" width="32%">

- In addition, we provide a printed receipt with the URL where you can check your transaction.

  <img src="https://i.ibb.co/zPBzLp9/Screenshot-20230812-172539.png" width="32%">

- Like this!

    <img src="./Img/gifPrint.gif" width="32%">

All the transactions carried out in base and the interactions with the Stargate Router in Base are in the following URL of the base explorer.

https://basescan.org/address/0x4cc9dbfc4beea8c986c61daabb350c2ec55e29d1

## Hopefully you liked the Point of Sale Dapp.

# Team

#### 3 Engineers with experience developing IoT and hardware solutions. We have been working together now for 6 years since University.

[<img src="https://img.shields.io/badge/Luis%20Eduardo-Arevalo%20Oliver-blue">](https://www.linkedin.com/in/luis-eduardo-arevalo-oliver-989703122/)

[<img src="https://img.shields.io/badge/Victor%20Alonso-Altamirano%20Izquierdo-lightgrey">](https://www.linkedin.com/in/alejandro-s%C3%A1nchez-guti%C3%A9rrez-11105a157/)

[<img src="https://img.shields.io/badge/Alejandro-Sanchez%20Gutierrez-red">](https://www.linkedin.com/in/victor-alonso-altamirano-izquierdo-311437137/)

## References:

https://egade.tec.mx/es/egade-ideas/opinion/la-inclusion-financiera-en-mexico-retos-y-oportunidades

https://www.cnbv.gob.mx/Inclusi%C3%B3n/Anexos%20Inclusin%20Financiera/Panorama_IF_2021.pdf?utm_source=Panorama&utm_medium=email

https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2021/OtrTemEcon/ENDUTIH_2020.pdf

https://www.cnbv.gob.mx/Inclusi%C3%B3n/Anexos%20Inclusin%20Financiera/Panorama_IF_2021.pdf?utm_source=Panorama&utm_medium=email

https://www.rappi.com

https://www.rapyd.net/

https://www.pointer.gg/tutorials/solana-pay-irl-payments/944eba7e-82c6-4527-b55c-5411cdf63b23#heads-up:-you're-super-early

https://worldpay.globalpaymentsreport.com/en/market-guides/mexico

https://www.sipa.columbia.edu/academics/capstone-projects/cryptocurrency-and-unbankedunderbanked-world
