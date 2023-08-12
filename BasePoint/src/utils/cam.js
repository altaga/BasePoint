import { View } from 'react-native'
import React, { Component } from 'react'
import { CameraScreen } from 'react-native-camera-kit'
import reactAutobind from 'react-autobind';
import ContextModule from './contextModule';

class Cam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanning: true
        }
        reactAutobind(this)
    }

    static contextType = ContextModule;

    render() {
        return (
            <View>
                <CameraScreen
                    scanBarcode={this.state.scanning}
                    onReadCode={
                        (event) => {
                            let temp = event.nativeEvent.codeStringValue
                            if (temp.length === 42 || temp.indexOf("ethereum:") > -1) {
                                temp = temp.replace("ethereum:","").substring(0,42)
                                this.setState({
                                    scanning: false
                                },
                                    () => {
                                        this.context.setValue({
                                            addressSelected: temp
                                        },
                                            () => this.props.navigation.navigate('Chat'))
                                    })
                            }
                        }}
                    showFrame={true}
                    laserColor='red'
                    frameColor='white'
                />
            </View>
        )
    }
}

export default Cam