// Basic Imports
import React, {Component} from 'react';
import {Pressable, Text, View} from 'react-native';
// Components Local
import Header from '../components/header';
// Utils
import reactAutobind from 'react-autobind';
// Utils Local
import ContextModule from '../../utils/contextModule';
// Styles
import GlobalStyles from '../../styles/styles';
// Assets
import IconMC from 'react-native-vector-icons/MaterialIcons';

import {NODE_ENV_NETWORKS} from '../../../env';
import Ctransactions from './cryptoTransactions';

function compareNumbers(a, b) {
  return b.timeStamp - a.timeStamp;
}

class CryptoMainTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };
    reactAutobind(this);
    this.mount = true;
  }

  static contextType = ContextModule;

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.mount = true;
      var myHeaders = new Headers();
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      let [transactions, tokenTransactions] = await Promise.all([
        new Promise((resolve, reject) => {
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
            .then(res => {
              resolve(res.result);
            })
            .catch(error => console.log('error', error));
        }),
        new Promise((resolve, reject) => {
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
            .then(response => response.json())
            .then(res => {
              resolve(res.result);
            })
            .catch(error => console.log('error', error));
        }),
      ]);
      let temp = transactions.concat(tokenTransactions);
      let temp2 = temp.sort(compareNumbers);
      console.log(temp2)
      this.mount &&
        this.setState({
          transactions: temp2,
        });
    });
    this.props.navigation.addListener('blur', () => {
      this.mount = false;
    });
  }

  componentWillUnmount() {
    this.mount = false;
    clearInterval(this.interval);
  }

  render() {
    return (
      <View style={GlobalStyles.container}>
        <Header />
        {
          <View
            style={{
              position: 'absolute',
              top: 9,
              left: 18,
              width: 36,
              height: 36,
            }}>
            <Pressable
              onPress={() => this.props.navigation.navigate('CryptoAccount')}>
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
        <View
          style={[
            GlobalStyles.mainSub,
            {
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            },
          ]}>
          <Text style={{textAlign: 'center', fontSize: 24, color: 'white'}}>
            {'\n'}Transactions:{'\n'}
          </Text>
          <Ctransactions
            transactions={this.state.transactions}
            from={this.context.value.account}
          />
        </View>
      </View>
    );
  }
}

export default CryptoMainTransactions;
