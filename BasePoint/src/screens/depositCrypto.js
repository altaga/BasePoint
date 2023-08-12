// Basic Imports
import React, {Component} from 'react';
import {Dimensions, Linking, Pressable, Text, View} from 'react-native';
// Components
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
import Icon from 'react-native-vector-icons/Feather';
import IconMC from 'react-native-vector-icons/MaterialIcons';
import {logo} from '../assets/logo';
// Styles
import GlobalStyles from '../styles/styles';

import {NODE_ENV_NETWORKS} from '../../env';

function epsilonRound(num, zeros = 4) {
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) /
    Math.pow(10, zeros)
  );
}

const BaseStateDepositCypto = {
  memory: 0,
  qr: null,
  signature: '',
  check: false,
  printData: '',
  amount: 0,
  signature: '',
  publish: {
    message: '',
    topic: '',
  },
  token: null,
};

class DepositCrypto extends Component {
  constructor(props) {
    super(props);
    this.state = BaseStateDepositCypto;
    reactAutobind(this);
    this.interval = null;
    this.mount = true;
    this.flag = true;
    this.svg = null;
  }

  static contextType = ContextModule;

  async getDataURL() {
    return new Promise(async (resolve, reject) => {
      this.svg.toDataURL(async data => {
        this.setState(
          {
            printData: 'data:image/png;base64,' + data,
          },
          () => resolve('ok'),
        );
      });
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.interval = null;
      this.mount = true;
      this.flag = true;
      this.svg = null;
      this.setState({
        token: NODE_ENV_NETWORKS[this.context.value.networkSelected].native,
      });
      this.interval = setInterval(() => {
        if (this.flag) {
          this.flag = false;
          var myHeaders = new Headers();
          const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
          };
          fetch(
            `${
              NODE_ENV_NETWORKS[this.context.value.networkSelected].api
            }?module=account&action=txlist&address=${
              this.context.value.account
            }&startblock=0&endblock=99999999&sort=desc&page=1&apikey=${
              NODE_ENV_NETWORKS[this.context.value.networkSelected].apiKey
            }`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              fetch(
                `${
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].api
                }?module=account&action=tokentx&address=${
                  this.context.value.account
                }&startblock=0&endblock=99999999&sort=desc&page=1&apikey=${
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].apiKey
                }`,
                requestOptions,
              )
                .then(responses => responses.json())
                .then(results => {
                  let temp = result.result
                    .concat(results.result)
                    .sort((a, b) => a.timeStamp < b.timeStamp);
                  let len = temp.length;
                  if (this.state.memory !== 0 && this.state.memory < len) {
                    this.mount &&
                      this.setState(
                        {
                          memory: len,
                          check: true,
                          signature: temp[0].hash,
                          amount:
                            temp[0].tokenSymbol !== undefined
                              ? epsilonRound(
                                  temp[0].value / temp[0].tokenDecimal,
                                )
                              : epsilonRound(
                                  temp[0].value * Math.pow(10, -18),
                                  8,
                                ),
                          token:
                            temp[0].tokenSymbol ??
                            NODE_ENV_NETWORKS[
                              this.context.value.networkSelected
                            ].native,
                        },
                        () => {
                          clearInterval(this.interval);
                        },
                      );
                  } else {
                    this.mount &&
                      this.setState(
                        {
                          memory: len,
                        },
                        () => {
                          this.flag = true;
                        },
                      );
                  }
                })
                .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
        }
      }, 10000);
    });
    this.props.navigation.addListener('blur', () => {
      this.setState(BaseStateDepositCypto);
      this.mount = false;
      this.interval && clearInterval(this.interval);
    });
  }

  componentWillUnmount() {
    this.mount = false;
    this.interval && clearInterval(this.interval);
  }

  callBackIoT = data => {
    console.log(data);
  };

  render() {
    return (
      <>
        <View style={GlobalStyles.container}>
          <Header />
          {
            <View style={{position: 'absolute', top: 9, left: 18}}>
              <Pressable
                onPress={() => this.props.navigation.navigate('Payments')}>
                <IconMC
                  name="arrow-back-ios"
                  size={36}
                  color={
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                  }
                />
              </Pressable>
            </View>
          }
          {!this.state.check ? (
            <View
              style={[
                GlobalStyles.mainSub,
                {
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 22,
                  width: '80%',
                }}>
                {NODE_ENV_NETWORKS[this.context.value.networkSelected].name}{' '}
                Address:
                {'\n'}
                {this.context.value.account.substring(0, 21)}
                {'\n'}
                {this.context.value.account.substring(21, 42)}
              </Text>
              <View
                style={{
                  borderColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                  borderWidth: 2,
                }}>
                <QRCode
                  value={this.context.value.account}
                  size={280}
                  quietZone={10}
                  ecl="H"
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 28,
                  width: '80%',
                }}>
                Scan with your{'\n'} mobile wallet
              </Text>
            </View>
          ) : (
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
                    `${
                      NODE_ENV_NETWORKS[this.context.value.networkSelected]
                        .explorer
                    }tx/` + this.state.signature,
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
                  },
                ]}
                onPress={async () => {
                  await this.getDataURL();
                  const results = await RNHTMLtoPDF.convert({
                    html: `
                                    <div style="text-align: center;">
                                    <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                    <img src='${logo}' width="450px"></img>
                                        <h1 style="font-size: 3rem;">--------- Original Reciept ---------</h1>
                                        <h1 style="font-size: 3rem;">Date: ${new Date().toLocaleDateString()}</h1>
                                        <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                        <h1 style="font-size: 3rem;">Direct Transfer</h1>
                                        <h1 style="font-size: 3rem;">Network: ${
                                          NODE_ENV_NETWORKS[
                                            this.context.value.networkSelected
                                          ].name
                                        }</h1>
                                        <h1 style="font-size: 3rem;">Amount: ${this.state.amount.toString()} ${
                      this.state.token + ' '
                    }</h1>
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
        <View style={{marginTop: Dimensions.get('window').height}}>
          <QRCode
            value={
              `${
                NODE_ENV_NETWORKS[this.context.value.networkSelected].explorer
              }tx/` + this.state.signature
            }
            size={Dimensions.get('window').width * 0.7}
            ecl="L"
            getRef={c => (this.svg = c)}
          />
        </View>
      </>
    );
  }
}

export default DepositCrypto;
