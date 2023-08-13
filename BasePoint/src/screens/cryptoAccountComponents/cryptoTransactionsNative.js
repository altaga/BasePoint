import React, { Component } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { NODE_ENV_NETWORKS } from '../../../env';
import ContextModule from '../../utils/contextModule';

function epsilonRound(num) {
    const zeros = 4;
    return Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) / Math.pow(10, zeros)
}

class Ctransactions extends Component {
    static contextType = ContextModule;
    render() {
        return (
            <ScrollView>
                {this.props.transactions.map((item, index, array) => (
                    <View key={index} style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginHorizontal: 16
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                            <View style={{ marginRight: 30 }}>
                                <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
                                    Date {"\n"}
                                    {new Date(item.timeStamp * 1000).toLocaleDateString()}
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
                                    Amount {"\n"}
                                    {
                                        item.tokenSymbol !== undefined ?
                                            <Text style={{
                                                color: item.from.toLowerCase() !== this.props.from.toLowerCase() ? '#009900' : '#990000'
                                            }}>
                                                {
                                                    epsilonRound(item.value / Math.pow(10, parseInt(item.tokenDecimal)))
                                                }
                                            </Text>
                                            :
                                            <Text style={{
                                                color: item.from.toLowerCase() !== this.props.from.toLowerCase() ? '#009900' : '#990000'
                                            }}>
                                                {
                                                    epsilonRound(item.value / 1000000000000000000)
                                                }
                                            </Text>
                                    }
                                    {"  "}
                                    {
                                        item.tokenSymbol !== undefined ? item.tokenSymbol : NODE_ENV_NETWORKS[this.context.value.networkSelected].native
                                    }
                                </Text>
                            </View>
                            <View style={{ marginLeft: 30 }}>
                                <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
                                    GasFee  {"\n"}{
                                        epsilonRound(item.gas * item.gasPrice / 1000000000000000000) > 0 ?
                                            epsilonRound(item.gas * item.gasPrice / 1000000000000000000)
                                            :
                                            ">0.0001"
                                    }
                                    {"  "}
                                </Text>
                            </View>
                        </View>
                        <View style={{width:"100%", alignSelf:"center"}}>
                            <Pressable onPress={() => Linking.openURL(`${NODE_ENV_EXPLORER[this.context.value.networkSelected]}tx/` + item.hash)}>
                                <Text style={{ color:"#0000FFAA",textAlign: "center", fontSize: 17, textDecorationLine: 'underline'}}>
                                {item.hash}
                            </Text>
                            </Pressable>
                        </View>
                        {
                            (array.length - 1) !== index && <View style={{ backgroundColor: NODE_ENV_NETWORKS[this.context.value.networkSelected].color, height: 1, width: "90%", marginVertical: 20, alignSelf:"center" }} />
                        }
                    </View>
                ))
                }
            </ScrollView>
        );
    }
}

export default Ctransactions;