# BasePoint

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [<img src="https://img.shields.io/badge/View-Video-red">](pending)

<img src="https://i.ibb.co/3zptyjD/logo-con-letras-azules.png" width="50%">

Welcome, this is our project for Superhack Hackathon - ETH Global.

# IMPORTANT!

## Application:

POS App APK: [LINK](./BasePointAPK/app-release.apk)

## Here is our main demo video:

[![Demo](https://i.ibb.co/g4W3ypx/image.png)](pending)

# Introduction and Problem

Basepoint is perhaps the first built on Base, Optimism-powered, Superchain enabled Point of Sale platform for retail and businesses.

When we were deciding on what to hack for the superhack we asked ourselves…

Have we really Banked the unbanked and reached the final consumer in our Web3 Applications?

Or, are we just feeding developers and speculators?

And that’s the main issue with Web3 at this moment. 

But, if we take a look at the state of the technology even one year ago, we could not focus on anything else as the fees and the networks at that time were not really there.

Now the technology is there with rollups, AI and the Superchain enabling us to reach more.


# Solution

BasePoint is a Mobile-First wallet, cash out ramp and Point of Sale Superapp. We combine TradFi through Rapyd with Web3 to improve Financial Inclusion in Mexico and LATAM

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

All transactions that require transfers from one chain to another we use the [Stargate Router Solidity Interface](https://stargateprotocol.gitbook.io/stargate/). Para mejorar la experiencia de pago y realizar transacciones sencillas con una wallet mobil se utilizo [WalletConnectV2](https://walletconnect.com/).

<img src="https://i.ibb.co/dfJv1S6/Screenshot-20230812-170711.png" width="32%"> <img src="https://i.ibb.co/1ZZyfRF/Screenshot-20230812-170716.png" width="32%"> <img src="https://i.ibb.co/tc71fpH/Screenshot-20230812-170723.png" width="32%">

La implementacion en el codigo de nuetsra app es la siguiente.

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

Ya que este protocolo de stargate es un protocolo DeFi y los bridges se realizan mediante transacciones a travez de pair pools, antes de realizar una transaccion crosschain tenemos que asegurarnos que el pair exista en la misma. Por eso es prefereible realizar pagos mediante stablecoins como USDC, ya que los pares de USDC y USDT existen en todas las redes. La app te indicara en el caso de no existir el pair.

<img src="https://i.ibb.co/TPX73RT/Screenshot-20230812-165810.png" width="33%"> <img src="https://i.ibb.co/Qkhmdkr/Screenshot-20230812-165816.png" width="33%">

# Covalent - Balances and Transfers.

<img src="https://i.ibb.co/8cXDrqq/image.png" width="33%">

Todos los balances e historial de transacciones que obtenemos en la app son directamente de la API de Covalent, esto con el fin de obtener un update rapido de estos y mantener la app escalable en el tiempo cuando tengamos un gran volumen de usuarios.

<img src="https://i.ibb.co/RBqqSgM/Screenshot-20230812-170915.png" width="32%"> <img src="https://i.ibb.co/1MzcJ2v/Screenshot-20230812-170920.png" width="32%">

La seccion de codigo para obtener los balances generales es la siguiente.

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

La seccion de codigo para obtener la lista de transacciones generales es la siguiente.

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

- One of the most important processes is being able to make payments at the POS through [WalletConnectV2](https://walletconnect.com/), being this the pillar of our device. Tendremos que seleccionar la red origen que nos hara la transferencia y posteriormente el token que se usara para pagar, en este caso tenemos compatibilidad con todos los pares disponibles en [Stargate.finance](https://stargate.finance/), recomendamos USDC y USDT.

    <img src="https://i.ibb.co/tHxvD6D/Screenshot-20230812-171509.png" width="32%"> 
    <img src="https://i.ibb.co/5jgXWC2/Screenshot-20230812-171513.png" width="32%"> 

- When the reference is created by QR, it can be paid through any wallet compatible with [WalletConnectV2](https://walletconnect.com/). Once the reference payment has been made, we will be able to see the confirmed and verified messages.


    <img src="https://i.ibb.co/tc71fpH/Screenshot-20230812-170723.png" width="32%">
    <img src="https://i.ibb.co/SmxSpk8/Screenshot-20230812-170748.png" width="32%">
    <img src="https://i.ibb.co/GPJHMxb/Screenshot-20230812-170902.png" width="32%">

- In addition, we provide a printed receipt with the URL where you can check your transaction.

  <img src="https://i.ibb.co/zPBzLp9/Screenshot-20230812-172539.png" width="32%">

- Let's print!

    <img src="./Img/gifPrint.gif" width="32%">

Todas las transacciones relizadas en base y las interacciones con el Router de Stargate en Base estan en el siguiente URL del base explorer.

https://basescan.org/address/0x4cc9dbfc4beea8c986c61daabb350c2ec55e29d1

# Current state and what's next

This application is directed at those who cannot benefit directly from cryptocurrency. It has the usual, both crypto and fiat wallets, transfers between crypto and fiat, transfers between crypto accounts and it gives a spin on the cash in - cash out portion of the equation as no other project provides it. It is very important if this application is going to benefit and bank people to be very agile and compatible with FIAT at least until crypto reaches mass market. Most of the developed world has not even incorporated to legacy electronic systems. In addition to that the incorporation of a Point of Sale thought mainly for SMEs is something that can be key in augmenting the change for further adoption.

I think we can make the jump from those systems almost directly to self-banking, such as the jump that was made in some parts of Africa and even here in Latin America from skipping telephone landlines directly to Mobile phones. If that jump was made from that type of technology this one can be analogous and possible.

Perhaps the most important feedback we have obtained is that we have to show how our application will ensure the enforcement of anti-laundering laws.

We will do that will strong KYC. And at the same time Mexico has published since 2018 strong laws to manage that including its fintech law.

https://en.legalparadox.com/post/the-definitive-guide-mexican-fintech-law-a-look-3-years-after-its-publication#:~:text=The%20Mexican%20FinTech%20Law%20was,as%20Artificial%20Intelligence%2C%20Blockchain%2C%20collaborative

Quoting: " The Mexican FinTech Law was one of the first regulatory bodies created specifically to promote innovation, the transformation of traditional banking and credit financial services that would even allow the possibility of incorporating exponential technology such as Artificial Intelligence, Blockchain, collaborative economies and peer-to-peer financial services in secure regulatory spaces. "

All of this was a silent revolution that happened in this jurisdiction after the HSBC money-laundering scandal that included cartels and some other nefarious individuals.
https://www.investopedia.com/stock-analysis/2013/investing-news-for-jan-29-hsbcs-money-laundering-scandal-hbc-scbff-ing-cs-rbs0129.aspx

Thus, the need for Decentralized solutions.

Security and identity verification of the clients who use the app is paramount for us, and to thrive in this market we need this to emulate incumbents such as Bitso. We think our technology is mature enough if we compare with these incumbents and much safer.

Regarding the application we would like to test it with real Capital perhaps in Q2 2023.

Hopefully you liked the Point of Sale Dapp.

# Team

#### 3 Engineers with experience developing IoT and hardware solutions. We have been working together now for 5 years since University.

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
