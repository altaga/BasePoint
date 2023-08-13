import React, {Component} from 'react';
import {Linking, Pressable, ScrollView, Text, View} from 'react-native';
import {NODE_ENV_NETWORKS} from '../../../env';
import ContextModule from '../../utils/contextModule';
import {ethers} from 'ethers';

function epsilonRound(num) {
  const zeros = 4;
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) /
    Math.pow(10, zeros)
  );
}

class Ctransactions extends Component {
  static contextType = ContextModule;
  render() {
    return (
      <ScrollView>
        {this.props.transactions.map((item, index, array) => (
          <View
            key={index}
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginHorizontal: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{marginRight: 30}}>
                <Text
                  style={{fontSize: 18, textAlign: 'center', color: 'white'}}>
                  Date {'\n'}
                  {new Date(item.block_signed_at).toLocaleDateString()}
                </Text>
              </View>
              <View>
                <Text
                  style={{fontSize: 18, textAlign: 'center', color: 'white'}}>
                  {item?.log_events &&
                  item?.log_events[0].decoded.name === 'Transfer' ? (
                    <React.Fragment>
                      <Text
                        style={{
                          color:
                            item.from_address.toLowerCase() !==
                            this.props.from.toLowerCase()
                              ? '#009900'
                              : '#990000',
                        }}>
                        {ethers.utils.formatUnits(
                          item.log_events[0].decoded.params[2].value,
                          item.log_events[0].sender_contract_decimals,
                        )}
                        {'\n'}
                      </Text>
                      {item.log_events[0].sender_contract_ticker_symbol}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Text
                        style={{
                          color:
                            item.from_address.toLowerCase() !==
                            this.props.from.toLowerCase()
                              ? '#009900'
                              : '#990000',
                        }}>
                        {ethers.utils.formatEther(item.value)}
                        {'\n'}
                      </Text>
                      {
                        NODE_ENV_NETWORKS[this.context.value.networkSelected]
                          .native
                      }
                    </React.Fragment>
                  )}
                </Text>
              </View>
              <View style={{marginLeft: 30}}>
                <Text
                  style={{fontSize: 18, textAlign: 'center', color: 'white'}}>
                  GasFee {'\n'}
                  {parseInt(item.fees_paid) > ethers.utils.parseEther('0.0001')
                    ? ethers.utils.formatEther(item.fees_paid)
                    : '>0.0001'}
                  {'  '}
                </Text>
              </View>
            </View>
            <View style={{width: '100%', alignSelf: 'center'}}>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `${
                      NODE_ENV_EXPLORER[this.context.value.networkSelected]
                    }tx/` + item.tx_hash,
                  )
                }>
                <Text
                  style={{
                    color: '#0000FFAA',
                    textAlign: 'center',
                    fontSize: 17,
                    textDecorationLine: 'underline',
                  }}>
                  {item.tx_hash}
                </Text>
              </Pressable>
            </View>
            {array.length - 1 !== index && (
              <View
                style={{
                  backgroundColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                  height: 1,
                  width: '90%',
                  marginVertical: 20,
                  alignSelf: 'center',
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>
    );
  }
}

export default Ctransactions;
