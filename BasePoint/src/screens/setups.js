// Basic Imports
import React, { Component } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
// Components
import VirtualKeyboard from "react-native-virtual-keyboard";
// Utils
import reactAutobind from "react-autobind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from "react-native-encrypted-storage";
// Utils Local
import ContextModule from "../utils/contextModule";
// Assets
import Icon from "react-native-vector-icons/FontAwesome5";
import logoETH from "../assets/logoETH.png";
// Styles
import GlobalStyles from "../styles/styles";
import { networkNames, contentColor } from "../../env";

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      pincode: "",
      text: "Create",
      phrase: "",
    };
    reactAutobind(this);
    this.checkPincode = false;
    this.checkWallet = false;
    this.checkAddress = false;
    this.checkId = false;
    this.ethers = require("ethers");
  }

  static contextType = ContextModule;

  async componentDidMount() {
    // await this.erase()
    // User Address
    try {
      const session = await AsyncStorage.getItem("chainId");
      if (session !== null) {
        this.context.setValue({
          networkSelected: JSON.parse(session).value,
        });
        this.checkId = true;
      } else {
        this.checkId = false;
      }
    } catch (error) {
      this.checkId = false;
    }
    try {
      const session = await AsyncStorage.getItem("userAddress");
      if (session !== null) {
        this.context.setValue({
          account: JSON.parse(session).value,
        });
        this.checkAddress = true;
      } else {
        this.checkAddress = false;
      }
    } catch (error) {
      this.checkAddress = false;
    }
    // User PIN
    try {
      const session = await EncryptedStorage.getItem("userPIN");
      if (session !== null) {
        this.checkPincode = true;
      } else {
        this.checkPincode = false;
      }
    } catch (error) {
      this.checkPincode = false;
    }
    // User Privs
    try {
      const session = await EncryptedStorage.getItem("userPrivs");
      if (session !== null) {
        console.log(session)
        this.checkWallet = true;
      } else {
        this.checkWallet = false;
      }
    } catch (error) {
      this.checkWallet = false;
    }
    if (this.checkWallet && this.checkPincode && this.checkAddress) {
      this.props.navigation.navigate("Payments");
    } else {
      this.setState({
        stage: 1,
      });
    }
  }

  async storeUserPIN() {
    try {
      await EncryptedStorage.setItem(
        "userPIN",
        JSON.stringify({
          value: this.state.pincode.substring(0, 4),
        })
      );
    } catch (error) {
      // There was an error on the native side
    }
  }

  async storeUserPrivs(value) {
    try {
      await EncryptedStorage.setItem(
        "userPrivs",
        JSON.stringify({
          value: value,
        })
      );
    } catch (error) {
      // There was an error on the native side
    }
  }

  async storeUserAddress(value) {
    try {
      await AsyncStorage.setItem("userAddress", JSON.stringify({ value }));
    } catch (e) {
      // saving error
    }
  }

  async storeDefaultChain(value) {
    try {
      await AsyncStorage.setItem("chainId", JSON.stringify({ value }));
    } catch (e) {
      // saving error
    }
  }

  changeText = (val) => {
    if (val.length <= 4) {
      this.setState({
        pincode: val,
      });
    }
  };

  // Dev Only
  async erase() {
    try {
      await EncryptedStorage.clear();
      await AsyncStorage.clear();
      // Congrats! You've just cleared the device storage!
    } catch (error) {
      // There was an error on the native side
    }
  }

  render() {
    return (
      <View style={GlobalStyles.containerSetup}>
        {this.state.stage === 0 && (
          <>
            <Image
              source={logoETH}
              style={{ height: 845 / 3.5, width: 727 / 3.5 }}
            />
          </>
        )}
        {this.state.stage === 1 && (
          <>
            <View style={{ height: "10%" }} />
            <Image
              source={logoETH}
              style={{ height: 845 / 3.5, width: 727 / 3.5 }}
            />
            <Text
              style={{
                textAlign: "center",
                width: "80%",
                fontSize: 24,
                fontFamily: "Helvetica",
                color: "white",
              }}
            >
              Point of Sale application for{" "}
              {NODE_ENV_NETWORKS[this.context.value.networkSelected].name}.
            </Text>
            <Pressable
              style={[
                GlobalStyles.button,
                {
                  backgroundColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                },
              ]}
              onPress={() =>
                this.setState({
                  stage: 2,
                })
              }
            >
              <Text style={[GlobalStyles.buttonText]}>Create new wallet</Text>
            </Pressable>
          </>
        )}
        {this.state.stage === 2 && (
          <>
            <View style={{ height: "10%" }} />
            <Icon name="shield-alt" size={128} color={"white"} />
            <Text
              style={{
                textAlign: "center",
                width: "80%",
                fontSize: 24,
                fontFamily: "Helvetica",
                color: "white",
              }}
            >
              Protect POS {"\n"}with a pincode
            </Text>
            <Pressable
              style={[
                GlobalStyles.button,
                {
                  backgroundColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                },
              ]}
              onPress={() =>
                this.setState({
                  stage: 3,
                })
              }
            >
              <Text style={[GlobalStyles.buttonText]}>Set Pincode</Text>
            </Pressable>
          </>
        )}
        {this.state.stage === 3 && (
          <>
            <Text
              style={{
                textAlign: "center",
                fontSize: 42,
                fontFamily: "Helvetica",
                color: "white",
              }}
            >
              Pincode Setup
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  width: "20%",
                  fontSize: 36,
                  fontFamily: "Helvetica",
                  color: "white",
                }}
              >
                {this.state.pincode.substring(0, 1) === ""
                  ? "•"
                  : this.state.pincode.substring(0, 1)}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  width: "20%",
                  fontSize: 36,
                  fontFamily: "Helvetica",
                  color: "white",
                }}
              >
                {this.state.pincode.substring(1, 2) === ""
                  ? "•"
                  : this.state.pincode.substring(1, 2)}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  width: "20%",
                  fontSize: 36,
                  fontFamily: "Helvetica",
                  color: "white",
                }}
              >
                {this.state.pincode.substring(2, 3) === ""
                  ? "•"
                  : this.state.pincode.substring(2, 3)}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  width: "20%",
                  fontSize: 36,
                  fontFamily: "Helvetica",
                  color: "white",
                }}
              >
                {this.state.pincode.substring(3, 4) === ""
                  ? "•"
                  : this.state.pincode.substring(3, 4)}
              </Text>
            </View>
            <VirtualKeyboard
              rowStyle={{
                width: Dimensions.get("window").width,
              }}
              cellStyle={{
                height: Dimensions.get("window").width / 7,
                borderWidth: 0,
                margin: 1,
              }}
              colorBack={"black"}
              color="white"
              pressMode="string"
              onPress={(val) => this.changeText(val)}
            />
            <Pressable
              style={[
                GlobalStyles.button,
                {
                  backgroundColor:
                    NODE_ENV_NETWORKS[this.context.value.networkSelected].color,
                },
              ]}
              onPress={async () => {
                await this.storeUserPIN();
                this.setState({
                  pincode: "",
                  stage: 4,
                });
              }}
            >
              <Text style={[GlobalStyles.buttonText]}>Set Pincode</Text>
            </Pressable>
          </>
        )}
        {this.state.stage === 4 && (
          <>
            <Text
              style={[GlobalStyles.simpleText, { fontSize: 24, width: "80%" }]}
            >
              Secret Recovery Phrase
            </Text>
            <Text style={[GlobalStyles.simpleText, { fontSize: 16 }]}>
              This is the only way you will be able to recover your wallet.
              Please store it somewhere safe.
            </Text>
            <View
              style={{
                backgroundColor: "#242426",
                width: "90%",
                height: "30%",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {["", "", ""].map((item, index) => {
                return (
                  <Text
                    key={"phrase" + index}
                    style={[
                      GlobalStyles.simpleTextPhrase,
                      { fontSize: 15, width: "33%" },
                    ]}
                  >
                    {item}
                  </Text>
                );
              })}
              {this.state.phrase.split(" ").map((item, index) => {
                return (
                  <Text
                    key={"phrase" + index}
                    style={[
                      GlobalStyles.simpleTextPhrase,
                      { fontSize: 24, width: "33%" },
                    ]}
                  >
                    {item}
                  </Text>
                );
              })}
            </View>
            <Pressable
              disabled={this.state.text === "Creating"}
              style={
                this.state.text === "Creating"
                  ? [
                      GlobalStyles.buttonDisabled,
                      {
                        backgroundColor: `${
                          NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                        }77`,
                      },
                    ]
                  : [
                      GlobalStyles.button,
                      {
                        backgroundColor: `${
                          NODE_ENV_NETWORKS[this.context.value.networkSelected].color
                        }`,
                      },
                    ]
              }
              onPress={() => {
                if (this.state.phrase !== "") {
                  this.props.navigation.navigate("Payments");
                } else {
                  this.setState(
                    {
                      text: "Creating",
                      phrase: "creating...",
                    },
                    () =>
                      setTimeout(() => {
                        const wallet = this.ethers.Wallet.createRandom();
                        this.storeUserAddress(wallet.address);
                        this.storeDefaultChain(0);
                        this.context.setValue({
                          account: wallet.address,
                        });
                        this.storeUserPrivs({
                          address: wallet.address,
                          phrase: wallet.mnemonic.phrase,
                          privateKey: wallet.privateKey,
                        }),
                          this.setState({
                            phrase: wallet.mnemonic.phrase,
                            text: "Complete Setup",
                          });
                      }, 500)
                  );
                }
              }}
            >
              <Text style={[GlobalStyles.buttonText]}>{this.state.text}</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }
}

export default Setup;
