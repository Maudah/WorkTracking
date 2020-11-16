import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

class MyModal extends React.Component {
  state = {
    time: new Date(),
    showTimePicker: false,
    showDatePicker: false,
  };
  componentDidUpdate(prevProps) {
    if (this.props.ModalVisible !== prevProps.ModalVisible) {
      this.render();
    }
  }
  onDateChange = (event, date) => {
    if (event.type == 'set') {
      this.setState({ time: date, showDatePicker: false, showTimePicker: true })
    } else {
      this.setState({ showDatePicker: false, showTimePicker: false })
    }
  };
  onTimeChange = (event, date) => {
    if (event.type == 'set') {
      this.setState({ time: date, showTimePicker: false })
    } else {
      this.setState({ showDatePicker: false, showTimePicker: false })
    }
  };
  onOkPress() {
    const { ModalVisible } = this.props;
    console.log();
    console.log(this.state.time, '-----');
    this.props.setTime(this.state.time);
    this.props.setModalVisible(!ModalVisible);
  }
  editDate = () => {
    this.setState({ showDatePicker: true });
  }
  render() {
    const { time, showDatePicker, showTimePicker } = this.state;
    const { ModalVisible, buttonText, onOkPress } = this.props;
    var displayDate = time.getDate() + '-' + (time.getMonth() + 1) + '-' + time.getFullYear();
    var displayTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    return (
      <>
        {showDatePicker && (
          <DateTimePicker
            value={time}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.onDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={this.onTimeChange}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { this.editDate(); }}>
                  <Image style={styles.editIcon} source={require('../images/edit-8-64.png')} />
                </TouchableOpacity>
                <Text style={styles.modalText}>{displayDate}  {displayTime}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableHighlight style={styles.cancelButton} onPress={() => { this.props.setModalVisible(!ModalVisible); }} >
                  <Text style={styles.cancelTextStyle}>ביטול</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.enterExitButton} onPress={() => {
                  this.props.onOkPress(time);
                  this.props.setModalVisible(!ModalVisible);
                }} >
                  <Text style={styles.textStyle}>{buttonText}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}


const styles = StyleSheet.create({
  editIcon: {
    width: 25,
    height: 25,
    margin: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 35,
    paddingHorizontal: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    padding: 10
  },
  enterExitButton: {
    backgroundColor: "#090F0F",
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    margin: 5
  },
  cancelButton: {
    backgroundColor: "#FFE4C4",
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    margin: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  cancelTextStyle: {
    color: "#090F0F",
    fontWeight: "bold",
    textAlign: "center"
  },
});
export default MyModal;