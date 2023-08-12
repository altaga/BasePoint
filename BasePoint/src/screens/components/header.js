import React, {Component} from 'react';
import {Image, View, Text, Pressable, Modal} from 'react-native';
import logoETH from '../../assets/logoETHcrop.png';
import GlobalStyles from '../../styles/styles';
import {
  NODE_ENV_NETWORKS,
  contentColor,
  headerColor,
  nativeIcon,
} from '../../../env';
import ContextModule from '../../utils/contextModule';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
    };
  }
  static contextType = ContextModule;

  async storeDefaultChain(value) {
    try {
      await AsyncStorage.setItem('chainId', JSON.stringify({value}));
    } catch (e) {
      // saving error
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          {/*All views of Modal*/}
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000077',
            }}>
            <View
              style={{
                width: '70%',
                height: '56%',
                backgroundColor: 'black',
                borderRadius: 10,
                borderColor:
                  NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                borderWidth: 1,
              }}>
              <View style={{margin: 10}}>
                <Text
                  style={{
                    fontSize: 24,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Select default chain
                </Text>
              </View>
              <View
                style={{
                  margin: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                {NODE_ENV_NETWORKS.map((item, index) => (
                  <React.Fragment key={'networkButton:' + index}>
                    <Pressable
                      onPress={async () => {
                        this.setState(
                          {
                            loading: true,
                          },
                          async () => {
                            await this.storeDefaultChain(index);
                            this.context.setValue(
                              {
                                networkSelected: index,
                              },
                              () => {
                                this.setState({
                                  visible: false,
                                  loading: false,
                                });
                              },
                            );
                          },
                        );
                      }}
                      style={{
                        width: '33%',
                        height: 90,
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 50, height: 50}}
                        source={item.nativeIcon}
                      />
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          onPress={() => {
            if (this.props.navigation ? true : false) {
              this.setState({
                visible: true,
              });
            }
          }}
          style={[
            GlobalStyles.header,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomColor:
                NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
            },
          ]}>
          <Image source={logoETH} style={{height: 46, width: 46}} />
        </Pressable>
      </React.Fragment>
    );
  }
}

export default Header;
