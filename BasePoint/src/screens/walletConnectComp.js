// Basic Imports
import React, {Component} from 'react';
import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
// Contracts
import {abiERC20} from '../contracts/erc20';
// Crypto
import Web3 from 'web3';

// Components
import {Picker} from 'react-native-form-component';
import QRCode from 'react-native-qrcode-svg';
// Components Local

import Header from './components/header';
// Utils
import reactAutobind from 'react-autobind';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
// Utils Local
import ContextModule from '../utils/contextModule';
// Assets
import Icon2 from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMCI from 'react-native-vector-icons/MaterialIcons';
import {logo} from '../assets/logo';
// Styles
import GlobalStyles from '../styles/styles';

import {NODE_ENV_NETWORKS, WalletConnectProjectID} from '../../env';
import {abiStargate} from '../contracts/stargate';

import UniversalProvider from '@walletconnect/universal-provider';
import {getSdkError} from '@walletconnect/utils';
import WalletConnectLogo from '../assets/wclogo.png';
import {BigNumber, ethers} from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

let BaseStateWalletConnectDeposit = {
  qr: null,
  account: '',
  stage: 0,
  network: NODE_ENV_NETWORKS.map((item, index) => ({
    ...item,
    label: item.name,
    value: item.rpc,
    networkSelected: index,
  }))[0],
  token: {
    label: NODE_ENV_NETWORKS[0].native,
    value: '',
    stargateID: 0,
  },
  tokenList: [
    {
      label: NODE_ENV_NETWORKS[0].native,
      value: '',
      stargateID: 0,
    },
  ].concat(
    NODE_ENV_NETWORKS[0].tokenNames.map((item, index) => ({
      label: item,
      value: NODE_ENV_NETWORKS[0].tokensContracts[index],
      stargatePool: NODE_ENV_NETWORKS[0].stargateID[index],
      indexToken: index,
    })),
  ),
  place: '',
  articles: '',
  amount: 0,
  signature: '',
  publish: {
    message: '',
    topic: '',
  },
  explorer: NODE_ENV_NETWORKS[0].explorer,
  mount: true,
};

class WalletConnectDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = BaseStateWalletConnectDeposit;
    reactAutobind(this);
    this.mount = true;
    this.svg = null;
    this.connector = null;
  }

  static contextType = ContextModule;

  async getDataURL() {
    return new Promise(async (resolve, reject) => {
      this.svg.toDataURL(async data => {
        this.mount &&
          this.setState(
            {
              printData: 'data:image/png;base64,' + data,
            },
            () => resolve('ok'),
          );
      });
    });
  }

  async setupWC() {
    this.mount &&
      this.setState({
        loading: true,
      });
    try {
      this.connector = await UniversalProvider.init({
        projectId: WalletConnectProjectID, // REQUIRED your projectId
        metadata: {
          name: 'BasePoint App',
          description:
            'BasePoint is a Mobile-First wallet, cash out ramp and Point of Sale Superapp',
          url: 'http://basepoint.com/',
          icons: ['https://i.ibb.co/5kjX84N/logo-ETHcrop.png'],
        },
      });
    } catch (err) {
      console.log(err);
      this.mount &&
        this.setState({
          loading: false,
        });
    }

    this.connector.on('display_uri', uri => {
      console.log(uri);
      (this.state.qr === null || this.state.stage === 0) &&
        this.mount &&
        this.setState({
          qr: uri,
          stage: 1,
          loading: false,
        });
    });

    // Subscribe to session ping
    this.connector.on('session_ping', ({id, topic}) => {
      console.log('session_ping', id, topic);
    });

    // Subscribe to session event
    this.connector.on('session_event', ({event, chainId}) => {
      console.log('session_event', event, chainId);
    });

    // Subscribe to session update
    this.connector.on('session_update', ({topic, params}) => {
      console.log('session_update', topic, params);
    });

    // Subscribe to session delete
    this.connector.on('session_delete', ({id, topic}) => {
      console.log('session_delete', id, topic);
    });

    // session established
    this.connector.on('connect', async e => {
      try {
        const address = await this.connector.request(
          {
            method: 'eth_accounts',
            params: [],
          },
          `eip155:${
            NODE_ENV_NETWORKS[this.context.value.networkSelected].chainId
          }`,
        );
        this.mount &&
          (await this.setStateAsync({
            account: address[0],
            stage: 2,
            loading: false,
          }));
        console.log(address[0]);
        this.createTransaction();
      } catch (err) {
        console.log(err);
      }
    });
    // session disconnect
    this.connector.on('disconnect', async e => {
      console.log(e);
      console.log('Connection Disconnected');
      this.connector && this.cancelAndClearConnection();
      this.mount && this.setState(BaseStateWalletConnectDeposit);
    });
    this.connector
      .connect({
        namespaces: {
          eip155: {
            methods: ['eth_sendTransaction'],
            chains: [
              `eip155:${
                NODE_ENV_NETWORKS[this.context.value.networkSelected].chainId
              }`,
            ],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {},
          },
        },
      })
      .then(e => {
        console.log('Connection OK');
        console.log(e);
      })
      .catch(async e => {
        console.log(e);
        console.log('Connection Rejected');
        this.connector && this.cancelAndClearConnection();
        this.mount && this.setState(BaseStateWalletConnectDeposit);
      });
  }

  async cancelAndClearConnection() {
    const topic = this.state.qr.substring(
      this.state.qr.indexOf('wc:') + 3,
      this.state.qr.indexOf('@'),
    );
    await this.connector.client.disconnect({
      topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
    await this.clearAsyncStorageWC();
    this.connector = null;
    delete this.connector;
  }

  async clearAsyncStorageWC() {
    console.log('Clear sessions');
    await AsyncStorage.multiRemove([
      'wc@2:client:0.3//proposal',
      'wc@2:client:0.3//session',
      'wc@2:core:0.3//expirer',
      'wc@2:core:0.3//history',
      'wc@2:core:0.3//keychain',
      'wc@2:core:0.3//messages',
      'wc@2:core:0.3//pairing',
      'wc@2:core:0.3//subscription',
      'wc@2:universal_provider:/namespaces',
      'wc@2:universal_provider:/optionalNamespaces',
      'wc@2:universal_provider:/sessionProperties',
    ]);
  }

  async createTransaction() {
    console.log('Transaction');
    console.log(this.state.token);
    if (
      this.state.token.label ===
      NODE_ENV_NETWORKS[this.context.value.networkSelected].native
    ) {
      console.log('transfer');
      this.transfer(
        this.state.amount,
        this.state.account,
        this.context.value.account,
      );
    } else if (
      this.state.network.name !==
      NODE_ENV_NETWORKS[this.context.value.networkSelected].name
    ) {
      console.log('xTransfer token');
      this.xTransferToken(
        this.state.amount,
        this.state.account,
        this.context.value.account,
        this.state.token.value,
      );
    } else {
      console.log('transfer token');
      this.transferToken(
        this.state.amount,
        this.state.account,
        this.context.value.account,
        this.state.token.value,
      );
    }
  }

  async transfer(amount, from, to) {
    try {
      let {rpc} = this.state.network;
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const nonce = await provider.getTransactionCount(from, 'latest');
      let transaction = {
        from,
        to,
        nonce,
        data: '0x',
        value: ethers.utils.parseUnits(amount.toString(), 'ether')._hex,
      };
      const gas = await provider.estimateGas(transaction);
      transaction = {
        ...transaction,
        gas: gas._hex,
      };
      console.log(transaction);
      const web3Provider = new ethers.providers.Web3Provider(this.connector);
      const result = await web3Provider.send('eth_sendTransaction', [
        transaction,
      ]);
      console.log(result);
      const receipt = await provider.waitForTransaction(result);
      console.log(receipt);
      this.mount &&
        (await this.setStateAsync({
          signature: result,
          explorer:
            NODE_ENV_NETWORKS[this.context.value.networkSelected].explorer,
          stage: 3,
        }));
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
    } catch (err) {
      console.log('Error on Transaction');
      console.log(err);
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
      this.mount && this.setState(BaseStateWalletConnectDeposit);
    }
  }

  async transferToken(amountToken, from, to, tokenAddress) {
    try {
      console.log('transfer Token');
      let {rpc} = this.state.network;
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        abiERC20,
        provider,
      );
      const tokenDecimals = await tokenContract.decimals();
      let amount = parseFloat(amountToken) * Math.pow(10, tokenDecimals);
      amount = BigNumber.from(amount.toString()).toBigInt();
      const nonce = await provider.getTransactionCount(from, 'latest');
      let transaction = await tokenContract.populateTransaction.transfer(
        to,
        amount.toString(),
      );
      transaction = {
        ...transaction,
        from,
        nonce,
        value: '0x0',
      };
      const gas = await provider.estimateGas(transaction);
      transaction = {
        ...transaction,
        gas: gas._hex,
      };
      console.log(transaction);
      const web3Provider = new ethers.providers.Web3Provider(this.connector);
      const result = await web3Provider.send('eth_sendTransaction', [
        transaction,
      ]);
      console.log(result);
      const receipt = await provider.waitForTransaction(result);
      console.log(receipt);
      this.mount &&
        (await this.setStateAsync({
          signature: result,
          explorer:
            NODE_ENV_NETWORKS[this.context.value.networkSelected].explorer,
          stage: 3,
        }));
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
    } catch (err) {
      console.log('Error on Transaction');
      console.log(err);
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
      this.mount && this.setState(BaseStateWalletConnectDeposit);
    }
  }

  async xTransferToken(amountToken, from, to, tokenAddress) {
    try {
      console.log('xTransfer Token');
      let {rpc, stargateContract, stargatePoolPairs} =
        NODE_ENV_NETWORKS[this.context.value.networkSelected];
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const web3Provider = new ethers.providers.Web3Provider(this.connector);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        abiERC20,
        provider,
      );
      const tokenDecimals = await tokenContract.decimals();
      let amount = ethers.utils.parseUnits(amountToken, tokenDecimals);
      let nonce = await provider.getTransactionCount(from, 'latest');
      // Approve
      let transaction = await tokenContract.populateTransaction.approve(
        stargateContract,
        amount,
      );
      transaction = {
        ...transaction,
        from,
        nonce,
        value: '0x0',
      };
      console.log(transaction);
      result = await web3Provider.send('eth_sendTransaction', [transaction]);
      console.log(result);
      let receipt = await provider.waitForTransaction(result);
      console.log(receipt);
      // Stargate
      nonce = await provider.getTransactionCount(from, 'latest');
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
      console.log(ethers.utils.formatEther(quoteData[0]));
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
      transaction = {
        ...transaction,
        from,
        nonce,
        value: quoteData[0]._hex,
      };
      console.log(quoteData[0]);
      //gas = await provider.estimateGas(transaction);
      transaction = {
        ...transaction,
        //gas: gas._hex,
      };
      result = await web3Provider.send('eth_sendTransaction', [transaction]);
      console.log(result);
      receipt = await provider.waitForTransaction(result);
      console.log(receipt);
      this.mount &&
        (await this.setStateAsync({
          signature: result,
          explorer: 'https://layerzeroscan.com/',
          stage: 3,
        }));
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
    } catch (err) {
      console.log('Error on Transaction');
      console.log(err);
      console.log('Clear Connection');
      this.connector && (await this.cancelAndClearConnection());
      this.mount && this.setState(BaseStateWalletConnectDeposit);
    }
  }

  // Natives

  setBaseState() {
    BaseStateWalletConnectDeposit = {
      qr: null,
      account: '',
      stage: 0,
      network: NODE_ENV_NETWORKS.map((item, index) => ({
        ...item,
        label: item.name,
        value: item.rpc,
        networkSelected: index,
      }))[this.context.value.networkSelected],
      token: {
        label: NODE_ENV_NETWORKS[this.context.value.networkSelected].native,
        value: '',
        stargateID: 0,
      },
      tokenList: [
        {
          label: NODE_ENV_NETWORKS[this.context.value.networkSelected].native,
          value: '',
          stargateID: 0,
        },
      ].concat(
        NODE_ENV_NETWORKS[this.context.value.networkSelected].tokenNames.map(
          (item, index) => ({
            label: item,
            value:
              NODE_ENV_NETWORKS[this.context.value.networkSelected]
                .tokensContracts[index],
            stargatePool:
              NODE_ENV_NETWORKS[this.context.value.networkSelected].stargateID[
                index
              ],
            indexToken: index,
          }),
        ),
      ),
      place: '',
      articles: '',
      amount: 0,
      signature: '',
      publish: {
        message: '',
        topic: '',
      },
      explorer: NODE_ENV_NETWORKS[this.context.value.networkSelected].explorer,
      mount: true,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.setBaseState();
      this.mount = true;
      this.setState(BaseStateWalletConnectDeposit);
    });
    this.props.navigation.addListener('blur', async () => {
      this.setBaseState();
      this.mount && this.setState(BaseStateWalletConnectDeposit);
      this.connector
        ? await this.cancelAndClearConnection()
        : await this.clearAsyncStorageWC();
      this.mount = false;
    });
  }

  async componentWillUnmount() {
    this.connector
      ? await this.cancelAndClearConnection()
      : await this.clearAsyncStorageWC();
  }

  // Utils

  async setStateAsync(value) {
    return new Promise(resolve => {
      this.mount &&
        this.setState(
          {
            ...value,
          },
          () => resolve(),
        );
    });
  }

  render() {
    return (
      <>
        <View style={GlobalStyles.container}>
          <Header />
          {
            <View style={{position: 'absolute', top: 9, left: 18}}>
              <Pressable
                onPress={() => this.props.navigation.navigate('Payments')}>
                <IconMCI
                  name="arrow-back-ios"
                  size={36}
                  color={
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                  }
                />
              </Pressable>
            </View>
          }
          {this.state.stage === 0 && (
            <ScrollView style={[GlobalStyles.mainSub]}>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  From Network
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    paddingTop: 10,
                  }}>
                  {NODE_ENV_NETWORKS[this.context.value.networkSelected].name}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                <Picker
                  isRequired
                  buttonStyle={{
                    fontSize: 28,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                    justifyContent: 'center',
                  }}
                  itemLabelStyle={[{fontSize: 24, textAlign: 'center'}]}
                  labelStyle={[
                    {fontSize: 28, textAlign: 'center', color: 'white'},
                  ]}
                  selectedValueStyle={[{fontSize: 28, textAlign: 'center'}]}
                  items={NODE_ENV_NETWORKS.map((item, index) => ({
                    ...item,
                    label: item.name,
                    value: item.rpc,
                    networkSelected: index,
                  }))}
                  label="To Network"
                  selectedValue={this.state.network.value}
                  onSelection={item => {
                    if (
                      item.networkSelected ===
                      this.context.value.networkSelected
                    ) {
                      this.mount &&
                        this.setState({
                          network: item,
                          token: [
                            {
                              label: item.native,
                              value: '',
                              stargateID: 0,
                            },
                          ].concat(
                            item.tokenNames.map((items, index) => ({
                              label: items,
                              value: item.tokensContracts[index],
                              stargateID: item.stargateID[index],
                              indexToken: index,
                            })),
                          )[0],
                          tokenList: [
                            {
                              label: item.native,
                              value: '',
                              stargateID: 0,
                            },
                          ].concat(
                            item.tokenNames.map((items, index) => ({
                              label: items,
                              value: item.tokensContracts[index],
                              stargateID: item.stargatePool[index],
                              indexToken: index,
                            })),
                          ),
                        });
                    } else {
                      this.mount &&
                        this.setState({
                          network: item,
                          token: NODE_ENV_NETWORKS[
                            this.context.value.networkSelected
                          ].tokenNames.map((items, index) => ({
                            label: items,
                            value:
                              NODE_ENV_NETWORKS[
                                this.context.value.networkSelected
                              ].tokensContracts[index],
                            stargateID:
                              NODE_ENV_NETWORKS[
                                this.context.value.networkSelected
                              ].stargatePool[index],
                            indexToken: index,
                          }))[0],
                          tokenList: NODE_ENV_NETWORKS[
                            this.context.value.networkSelected
                          ].tokenNames.map((items, index) => ({
                            label: items,
                            value:
                              NODE_ENV_NETWORKS[
                                this.context.value.networkSelected
                              ].tokensContracts[index],
                            stargateID:
                              NODE_ENV_NETWORKS[
                                this.context.value.networkSelected
                              ].stargatePool[index],
                            indexToken: index,
                          })),
                        });
                    }
                  }}
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                <Picker
                  isRequired
                  buttonStyle={{
                    fontSize: 28,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                    justifyContent: 'center',
                  }}
                  itemLabelStyle={[{fontSize: 24, textAlign: 'center'}]}
                  labelStyle={[
                    {fontSize: 28, textAlign: 'center', color: 'white'},
                  ]}
                  selectedValueStyle={[{fontSize: 28, textAlign: 'center'}]}
                  items={this.state.tokenList}
                  label="Token"
                  selectedValue={this.state.token.value}
                  onSelection={item => {
                    this.mount &&
                      this.setState({
                        token: item,
                      });
                  }}
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Amount
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="number-pad"
                  value={this.state.amount.toString()}
                  onChangeText={value =>
                    this.mount && this.setState({amount: value})
                  }
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Place
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="default"
                  value={this.state.place}
                  onChangeText={value =>
                    this.mount && this.setState({place: value})
                  }
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 30,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Articles
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="default"
                  value={this.state.articles}
                  onChangeText={value =>
                    this.mount && this.setState({articles: value})
                  }
                />
              </View>
              <Pressable
                disabled={this.state.loading}
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor: `${
                      NODE_ENV_NETWORKS[this.context.value.networkSelected]
                        .color
                    }${this.state.loading ? '77' : ''}`,
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={() => {
                  let check = false;
                  try {
                    check =
                      NODE_ENV_NETWORKS[this.context.value.networkSelected]
                        .stargatePoolPairs[this.state.token.indexToken][
                        this.state.network.networkSelected
                      ] === 0 &&
                      this.state.network.networkSelected !==
                        this.context.value.networkSelected;
                  } catch {
                    check = false;
                  }
                  if (check)
                    ToastAndroid.showWithGravity(
                      'No pool pair available for this option',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  else {
                    this.setupWC();
                  }
                }}>
                <Text style={[GlobalStyles.buttonText]}>Pay</Text>
              </Pressable>
            </ScrollView>
          )}
          {this.state.stage === 1 && (
            <View style={[GlobalStyles.mainSub, {}]}>
              {this.state.qr && (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[{fontSize: 24, color: 'white', marginVertical: 4}]}>
                    Scan
                  </Text>
                  <View
                    style={{
                      borderColor:
                        NODE_ENV_NETWORKS[this.context.value.networkSelected]
                          .color,
                      borderWidth: 2,
                    }}>
                    <QRCode
                      value={this.state.qr}
                      size={Dimensions.get('window').height / 1.8}
                      quietZone={10}
                      ecl="H"
                    />
                  </View>
                  {this.state.network.networkSelected !==
                    this.context.value.networkSelected && (
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor:
                          NODE_ENV_NETWORKS[this.context.value.networkSelected]
                            .color,
                        borderRadius: 10,
                        width: '90%',
                        marginTop: 10,
                      }}>
                      <Text
                        style={[
                          {fontSize: 24, color: 'white', marginVertical: 10},
                        ]}>
                        From Network:{' '}
                        {
                          NODE_ENV_NETWORKS[this.context.value.networkSelected]
                            .name
                        }
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor:
                        NODE_ENV_NETWORKS[this.context.value.networkSelected]
                          .color,
                      borderRadius: 10,
                      width: '90%',
                      marginTop: 10,
                    }}>
                    <Text
                      style={[
                        {fontSize: 24, color: 'white', marginVertical: 10},
                      ]}>
                      Amount: {this.state.amount.toString()}{' '}
                      {this.state.token.label}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          {this.state.stage === 2 && (
            <View
              style={[
                GlobalStyles.mainSub,
                {
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
              ]}>
              <Icon
                name="wallet"
                size={128}
                color={
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                }
              />
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Wallet Connected
              </Text>
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 18,
                  color: '#AAA',
                  paddingTop: 10,
                  textAlign: 'center',
                  width: '60%',
                }}>
                Review and sign the transaction to complete...
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                  borderRadius: 10,
                  width: '90%',
                  height: '30%',
                  marginTop: 20,
                }}>
                <Text style={[{fontSize: 24, color: 'white'}]}>
                  Amount: {this.state.amount.toString()}{' '}
                  {this.state.token.label}
                </Text>
                {this.state.place && (
                  <Text style={[{fontSize: 24, color: 'white'}]}>
                    Place: {this.state.place}
                  </Text>
                )}
                {this.state.articles && (
                  <Text style={[{fontSize: 24, color: 'white'}]}>
                    Articles: {this.state.articles}
                  </Text>
                )}
              </View>
            </View>
          )}
          {this.state.stage === 3 && (
            <View
              style={[
                GlobalStyles.mainSub,
                {
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
              ]}>
              <Icon2
                name="check-circle"
                size={160}
                color={
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                }
              />
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Completed
              </Text>
              <Pressable
                style={{marginVertical: 30}}
                onPress={() =>
                  Linking.openURL(
                    `${this.state.explorer}tx/` + this.state.signature,
                  )
                }>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  View on Explorer
                </Text>
              </Pressable>
              <Pressable
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor:
                      NODE_ENV_NETWORKS[this.context.value.networkSelected]
                        .color,
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={async () => {
                  await this.getDataURL();
                  const results = await RNHTMLtoPDF.convert({
                    html: `
                                        <div style="text-align: center;">
                                        <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                        <img src='${logo}' width="300px"></img>
                                            <h1 style="font-size: 3rem;">--------- Original Reciept ---------</h1>
                                            <h1 style="font-size: 3rem;">Date: ${new Date().toLocaleDateString()}</h1>
                                            <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                            <h1 style="font-size: 3rem;">WalletConnect Transfer</h1>
                                            <h1 style="font-size: 3rem;">Network: ${
                                              NODE_ENV_NETWORKS[
                                                this.context.value
                                                  .networkSelected
                                              ].name
                                            }</h1>
                                            <h1 style="font-size: 3rem;">Amount: ${
                                              this.state.amount.toString() + ' '
                                            }${this.state.token.label}</h1>
                                            ${
                                              this.state.place &&
                                              `<h1 style="font-size: 3rem;">Place:${this.state.place}</h1>`
                                            }
                                            ${
                                              this.state.articles &&
                                              `<h1 style="font-size: 3rem;">Articles:${this.state.articles}</h1>`
                                            }
                                            <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                            <img src='${
                                              this.state.printData
                                            }'></img>
                                        </div>
                                        `,
                    fileName: 'print',
                    base64: true,
                  });
                  await RNPrint.print({filePath: results.filePath});
                }}>
                <Text style={[GlobalStyles.buttonText]}>Print Receipt</Text>
              </Pressable>
              <Pressable
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor:
                      NODE_ENV_NETWORKS[this.context.value.networkSelected]
                        .color,
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={() => {
                  this.props.navigation.navigate('Payments');
                }}>
                <Text style={[GlobalStyles.buttonText]}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={{position: 'absolute', bottom: -500}}>
          <QRCode
            value={this.state.explorer + 'tx/' + this.state.signature}
            size={Dimensions.get('window').width * 0.7}
            ecl="L"
            getRef={c => (this.svg = c)}
          />
        </View>
      </>
    );
  }
}

export default WalletConnectDeposit;
