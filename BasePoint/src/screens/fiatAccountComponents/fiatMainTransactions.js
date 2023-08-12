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

import Transactions from './fiatTransactions';
import {NODE_ENV_NETWORKS} from '../../../env';

class FiatMainTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };
    reactAutobind(this);
    this.axios = require('axios');
    this.source = this.axios.CancelToken.source();
    this.mount = true;
  }

  static contextType = ContextModule;

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.mount = true;
      this.getTransactionsRapyd();
    });
    this.props.navigation.addListener('blur', () => {
      this.mount = false;
    });
  }

  componentWillUnmount() {
    this.mount = false;
    clearInterval(this.interval);
  }

  async getTransactionsRapyd() {
    const myHeaders = new Headers();
    myHeaders.append('ewallet', this.context.value.ewallet);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(
      'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-transactions-ewallet',
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        this.mount &&
          this.setState({
            transactions: res.data,
          });
      })
      .catch(error => console.log('error', error));
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
              onPress={() => this.props.navigation.navigate('FiatAccount')}>
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
          <Transactions
            transactions={this.state.transactions}
            from={this.context.value.account}
          />
        </View>
      </View>
    );
  }
}

export default FiatMainTransactions;
