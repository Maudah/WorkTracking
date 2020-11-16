import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import MyModal from '../components/modal.js';

class HomeScreen extends React.Component {
  state = {
    modalVisible: false,
    enterModalVisible: false,
    exitModalVisible: false,
    loading: false
  };
  
  setEnterModalVisible = (visible) => {
    this.setState({ enterModalVisible: visible });
  }
  setExitModalVisible = (visible) => {
    this.setState({ exitModalVisible: visible });
  }
  setEnterTime = (date) => {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/enters.txt';
    RNFS.exists(path)
      .then(success => {
        if (success) {
          RNFS.appendFile(path, date.toString() + `$`, 'utf8')
            .then((success1) => {
              ToastAndroid.show(" כניסה הוחתמה בהצלחה", ToastAndroid.LONG);
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else {
          RNFS.writeFile(path, date.toString() + `$`, 'utf8')
            .then((success) => {
              ToastAndroid.show("כניסה הוחתמה בהצלחה ", ToastAndroid.LONG);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      })
      .catch(err => {
        ToastAndroid.show("ERROR!!" + err.message + err.code, ToastAndroid.LONG);
      });


    }
  setExitTime = (date) => {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/exits.txt';

    RNFS.exists(path)
      .then(success => {
        if (success) {
          RNFS.appendFile(path, date.toString() + `$`, 'utf8')
            .then((success1) => {
              ToastAndroid.show(" יציאה הוחתמה בהצלחה", ToastAndroid.LONG);
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else {
          RNFS.writeFile(path, date.toString() + `$`, 'utf8')
            .then((success) => {
              ToastAndroid.show("יציאה הוחתמה בהצלחה ", ToastAndroid.LONG);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      })
      .catch(err => {
        ToastAndroid.show("ERROR!!" + err.message + err.code, ToastAndroid.LONG);
      });
    }
  render() {
    const { enterModalVisible, exitModalVisible, loading } = this.state;
    return (
      <View style={styles.container}>
        <MyModal
          ModalVisible={enterModalVisible}
          setModalVisible={this.setEnterModalVisible}
          onOkPress={this.setEnterTime}
          buttonText={'כניסה'}
        />
        <MyModal
          ModalVisible={exitModalVisible}
          setModalVisible={this.setExitModalVisible}
          onOkPress={this.setExitTime}
          buttonText={'יציאה'}
        />

        {loading && <View style={{ padding: 10, zIndex: 2, position: 'absolute' }}>
          <ActivityIndicator size="large" color="black" />
        </View>}

        <View style={styles.upperPart}>
          <Image style={styles.logo} source={require('../images/data-configuration-256.png')} />
        </View>

        <View style={styles.buttonsPart}>
          <View style={{ display: 'flex', flex: 1 }}>
            <TouchableOpacity disabled={loading} style={styles.buttonStyle} onPress={() => this.setExitModalVisible(true)}>
              <Image style={styles.icon} source={require('../images/so-so-256.png')} />
              <Text style={styles.text}> יציאה</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} style={styles.buttonStyle} onPress={() => { this.props.navigation.navigate('Track') }}>
            <Image style={styles.icon} source={require('../images/day-view-256.png')} />
              <Text style={styles.text}>מעקב עבודה</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: 'flex', flex: 1 }}>
            <TouchableOpacity disabled={loading} style={styles.buttonStyle}
              onPress={() => this.setEnterModalVisible(true)}>
              <Image style={styles.icon} source={require('../images/running-man-256.png')} />
              <Text style={styles.text}>כניסה</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} style={styles.buttonStyle} onPress={() => { this.props.navigation.navigate('Edit') }}>
              <Image style={styles.icon} source={require('../images/edit-9-256.png')} />
              <Text style={styles.text}>עדכון שעות </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#090F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upperPart: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  buttonsPart: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
    flex: 1.5,
    width: '100%'
  },
  buttonStyle: {
    backgroundColor: '#FFE4C4',
    display: 'flex',
    flex: 1,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 150
  },
  icon: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    margin: 10
  },
  text: {
    fontSize: 25,
  },
});

export default HomeScreen;