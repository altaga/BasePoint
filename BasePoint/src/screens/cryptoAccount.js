// Basic Imports
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
// Crypto
import Web3 from 'web3';
// Contracts
import {abiERC20} from '../contracts/erc20';
import {abiFeeds} from '../contracts/priceFeedContract';
// Components Local
import Footer from './components/footer';
import Header from './components/header';
// Utils
import reactAutobind from 'react-autobind';
// Utils Local
import ContextModule from '../utils/contextModule';
// Styles
import GlobalStyles from '../styles/styles';
// Assets

import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';

import Chart from './cryptoAccountComponents/chart';

import {
  NODE_ENV_CHAINLINK_FEED_CONTRACT,
  NODE_ENV_DATA_FEEDS_RCP,
  NODE_ENV_NETWORKS,
  covalentKey,
} from '../../env';
import {ethers} from 'ethers';

async function getUSD(array) {
  return new Promise((resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${array.toString()}&vs_currencies=usd`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => resolve(JSON.parse(result)))
      .catch(error => console.log('error', error));
  });
}

function epsilonRound(num, zeros = 4) {
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) /
    Math.pow(10, zeros)
  );
}

class CryptoAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      modal: false,
    };
    reactAutobind(this);
    this.web3 = null;
    this.web3Feeds = new Web3(NODE_ENV_DATA_FEEDS_RCP);
    this.contract = new this.web3Feeds.eth.Contract(
      abiFeeds,
      NODE_ENV_CHAINLINK_FEED_CONTRACT,
    );
    this.mount = true;
  }

  static contextType = ContextModule;

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

  async componentDidMount() {
    this.web3 = new Web3(
      NODE_ENV_NETWORKS[this.context.value.networkSelected].rpc,
    );
    this.props.navigation.addListener('focus', async () => {
      this.mount = true;
      this.mount &&
        this.setState({
          modal: false,
        });
      // Native
      const res = await this.getBalances();
      const nativeData = res.filter(item => item.native_token === true)[0];
      const ethUSD = nativeData.quote_rate;
      const ethBalance = parseFloat(
        ethers.utils.formatUnits(
          nativeData.balance,
          nativeData.contract_decimals,
        ),
      );
      // Tokens
      const tokensData = res.filter(item => item.native_token === false);
      let tokenBalances = {};
      let tokenUSD = {};
      NODE_ENV_NETWORKS[
        this.context.value.networkSelected
      ].tokensContracts.forEach((item, index) => {
        try {
          const tokenInfo = tokensData.filter(
            item2 =>
              item.toLowerCase() === item2.contract_address.toLowerCase(),
          )[0];
          tokenBalances[
            NODE_ENV_NETWORKS[this.context.value.networkSelected].tokenNames[
              index
            ]
          ] =
            parseFloat(
              ethers.utils.formatUnits(
                tokenInfo?.balance ?? 0,
                tokenInfo?.contract_decimals ?? 1,
              ),
            ) ?? 0;
          tokenUSD[
            NODE_ENV_NETWORKS[this.context.value.networkSelected].tokenNames[
              index
            ]
          ] = tokenInfo?.quote_rate ?? 1;
        } catch (e) {
          // nothing
        }
        this.context.setValue({
          ethBalance,
          ethUSD,
          tokenBalances,
          tokenUSD,
        });
      });
    });
    this.props.navigation.addListener('blur', () => {
      this.mount = false;
      this.setState({
        modal: false,
      });
    });
  }

  componentWillUnmount() {
    this.mount = false;
  }

  render() {
    return (
      <>
        <View style={GlobalStyles.container}>
          <Header />
          <Pressable
            onPress={() => this.props.navigation.navigate('CryptoTransactions')}
            style={{position: 'absolute', top: 9, left: 18}}>
            <View style={{alignSelf: 'center'}}>
              <IconMI
                name="receipt-long"
                size={24}
                color={
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                }
              />
            </View>
            <Text style={{color: 'white'}}>Transactions</Text>
          </Pressable>
          <View style={{position: 'absolute', top: 9, right: 18}}>
            <Pressable
              style={{alignSelf: 'center'}}
              onPress={() => this.props.navigation.navigate('CryptoCashOut')}>
              <IconMCI
                name="cash-fast"
                size={24}
                color={
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                }
              />
            </Pressable>
            <Text style={{color: 'white'}}>Withdraw</Text>
          </View>
          <View
            style={[
              GlobalStyles.main,
              {flexDirection: 'column', alignItems: 'center', paddingTop: 10},
            ]}>
            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'black',
                  width: '100%',
                }}>
                <Pressable
                  onPress={() =>
                    this.context.setValue({
                      show: !this.context.value.show,
                    })
                  }>
                  <Text
                    style={{textAlign: 'center', color: 'white', fontSize: 20}}>
                    {NODE_ENV_NETWORKS[this.context.value.networkSelected].name}{' '}
                    Address
                    {'\n'}
                    {this.context.value.account.substring(0, 7)}
                    ...
                    {this.context.value.account.substring(35, 42)}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View
              style={{
                backgroundColor:
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                height: 2,
                width: '90%',
                marginVertical: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>
                Balance
              </Text>
              <Pressable
                onPress={() =>
                  this.context.setValue({
                    show: !this.context.value.show,
                  })
                }>
                <Text style={{fontSize: 30, color: 'white'}}>
                  {'$ '}
                  {this.context.value.show
                    ? epsilonRound(
                        this.context.value.ethBalance *
                          this.context.value.ethUSD +
                          NODE_ENV_NETWORKS[
                            this.context.value.networkSelected
                          ].tokenNames
                            .map(
                              item =>
                                this.context.value.tokenBalances[item] ??
                                0 * this.context.value.tokenUSD[item] ??
                                0,
                            )
                            .reduce((partialSum, a) => partialSum + a, 0),
                        2,
                      )
                    : '***'}
                  {' USD'}
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                backgroundColor:
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                height: 2,
                width: '90%',
                marginVertical: 10,
              }}
            />
            <View style={{height: '15%'}}>
              <ScrollView persistentScrollbar>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '33.33%'}}>
                    {this.context.value.show ? (
                      <Image
                        source={
                          NODE_ENV_NETWORKS[this.context.value.networkSelected]
                            .nativeIcon
                        }
                        style={{width: 20, height: 20, alignSelf: 'center'}}
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'white',
                          alignSelf: 'center',
                        }}>
                        {'***'}{' '}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      width: '33.33%',
                      textAlign: 'center',
                    }}>
                    {this.context.value.show
                      ? NODE_ENV_NETWORKS[this.context.value.networkSelected]
                          .native
                      : '***'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      width: '33.33%',
                      textAlign: 'center',
                    }}>
                    {' '}
                    {this.context.value.show
                      ? epsilonRound(parseFloat(this.context.value.ethBalance))
                      : '***'}{' '}
                  </Text>
                </View>
                {NODE_ENV_NETWORKS[
                  this.context.value.networkSelected
                ].tokenNames.map(
                  (item, index) =>
                    epsilonRound(this.context.value.tokenBalances[item], 6) >
                      0 && (
                      <React.Fragment key={index + 'Value'}>
                        <View
                          style={{
                            backgroundColor: '#78d64b55',
                            height: 0.5,
                            width: Dimensions.get('window').width * 0.9,
                            marginVertical: 8,
                            alignSelf: 'center',
                          }}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View style={{width: '33.33%'}}>
                            {this.context.value.show ? (
                              <Image
                                source={
                                  NODE_ENV_NETWORKS[
                                    this.context.value.networkSelected
                                  ].tokenIcons[index]
                                }
                                style={{
                                  width: 20,
                                  height: 20,
                                  alignSelf: 'center',
                                }}
                              />
                            ) : (
                              <Text
                                style={{
                                  fontSize: 20,
                                  color: 'white',
                                  alignSelf: 'center',
                                }}>
                                {'***'}{' '}
                              </Text>
                            )}
                          </View>
                          <Text
                            style={{
                              fontSize: 20,
                              color: 'white',
                              width: '33.33%',
                              textAlign: 'center',
                            }}>
                            {this.context.value.show ? item : '***'}
                          </Text>
                          <Text
                            style={{
                              fontSize: 20,
                              color: 'white',
                              width: '33.33%',
                              textAlign: 'center',
                            }}>
                            {' '}
                            {this.context.value.show
                              ? epsilonRound(
                                  this.context.value.tokenBalances[item],
                                  2,
                                )
                              : '***'}{' '}
                          </Text>
                        </View>
                      </React.Fragment>
                    ),
                )}
              </ScrollView>
            </View>
            <View
              style={{
                backgroundColor:
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                height: 2,
                width: '90%',
                marginVertical: 10,
              }}
            />
            <Chart
              size={180}
              data={[
                this.context.value.ethBalance * this.context.value.ethUSD,
              ].concat(
                NODE_ENV_NETWORKS[
                  this.context.value.networkSelected
                ].tokenNames.map(
                  item =>
                    this.context.value.tokenBalances[item] ??
                    0 * this.context.value.tokenUSD[item] ??
                    0,
                ),
              )}
              dataColors={[
                NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
              ].concat(
                NODE_ENV_NETWORKS[this.context.value.networkSelected]
                  .tokenColors,
              )}
              dataLabels={[
                NODE_ENV_NETWORKS[this.context.value.networkSelected].native,
              ].concat(
                NODE_ENV_NETWORKS[this.context.value.networkSelected]
                  .tokenNames,
              )}
              dataMultipliers={[1 / this.context.value.ethUSD, 1, 1]}
              show={this.context.value.show}
              round={[4, 2, 4]}
            />
          </View>
          <Footer navigation={this.props.navigation} />
        </View>
      </>
    );
  }
}

export default CryptoAccount;
