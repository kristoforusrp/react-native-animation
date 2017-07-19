import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Easing,
  LayoutAnimation,
  TouchableOpacity,
  NativeModules,
  Button
} from 'react-native'


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      loading: false,
      type: 'rotate',
      animate: '0deg',
      movingMargin: null,
      w: 150,
      h: 160
    }
    this.spinValue = new Animated.Value(0)
    this.scaleValue = new Animated.Value(0.3)
    this.divideScale = new Animated.Value(0)
  }

  setAnimation = (effect) => {
    switch (effect) {
      case 'scale':
        this.setState({ animate: this.scaleValue, type: 'scale' })
        this.scale()

        break;

      case 'moveit':
        const margin300 = this.divideScale.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 300, 0]
        })
        this.setState({ movingMargin: margin300 })
        this.moveit()

        break;

      case 'stopmove':
        const movingMargin = this.divideScale.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 0]
        })
        this.setState({ movingMargin: movingMargin })
        this.stopmove()

        break;

      case 'spin':
         const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
         })
         this.setState({ animate: spin })
         this.spin()

         break;

      case 'stopspin':
        const stopSpin = this.spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '0deg']
        })
        this.setState({ animate: stopSpin })
        this.stopSpin()

        break;


      default:
        break;
    }
  }

  moveit = () => {
    this.divideScale.setValue(0.3)
        Animated.timing(
          this.divideScale,
          {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce
          }
        ).start(() => this.moveit())
  }

  stopmove = () => {
    this.divideScale.setValue(0)
    Animated.timing(
      this.divideScale,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.bounce
      }
    )
  }
  spin = () => {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
    this.setState({ loading: true })
  }

  stopSpin = () => {
    Animated.timing(
      this.spinValue,
      {
        toValue: 0,
        duration: 4000,
        easing: Easing.bounce
      }
    )
    this.setState({ loading: false })
  }

  scale = () => {
    Animated.spring(this.scaleValue, {
      toValue: 2,
      duration: 3000,
      easing: Easing.elastic,
      friction: 5
    }).start()
  }

  bigger = () => {
    LayoutAnimation.spring();
    this.setState({w: this.state.w + 15, h: this.state.h + 15})
  }

  smaller = () => {
    LayoutAnimation.spring();
    this.setState({w: this.state.w - 15, h: this.state.h - 15})
  }

  render() {

    const movingMargin = this.spinValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-300, 300, 0]
    })

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity>
          <Button
            title="Spin"
            onPress={ () => this.setAnimation('spin') }
          />
          </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="stop Spin"
            onPress={ () => this.setAnimation('stopspin') }
          />
         </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="Scale"
            onPress={ () => this.setAnimation('scale') }
          />
         </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="moveit"
            onPress={ () => this.setAnimation('moveit')  }
          />
         </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="Stop the Move"
            onPress={ () => this.setAnimation('stopmove') }
          />
         </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="bigger"
            onPress={ () => this.bigger() }
          />
         </TouchableOpacity>
         <TouchableOpacity>
          <Button
            title="smaller"
            onPress={ () => this.smaller() }
          />
         </TouchableOpacity>
      </View>

         <View style={styles.container}>

          <Animated.Image
            style={{
              width: this.state.w,
              height: this.state.h,
              transform: [{[this.state.type]: this.state.animate  }]
            }}
            source={require('./react.png')}
          />

          <Animated.View
            style={{
              marginLeft: this.state.movingMargin,
              marginTop: 10,
              height: 30,
              width: 40,
              backgroundColor: 'orange'}}
          />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {
    flex: 3,
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexBasis: 150,
    marginLeft: 10,
    marginTop: 20,
  }
});
