import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet, ScrollView, Picker, Dimensions, Modal, TouchableOpacity, Image, TouchableHighlight, ToastAndroid } from 'react-native';

class EditRecordsScreen extends React.Component {
  state = {
    entersContent: [],
    exitsContent: [],
    originEntersContent: [],
    originExitsContent: [],
    entersContentToUpdate: [],
    exitsContentToUpdate: [],
    loading: true,
    categoryToDisplay: 'enters',
    ModalVisible: false,
    removeModalVisible: false,
  };
  constructor() {
    super();
  }
  async componentDidMount() {
    var RNFS = require('react-native-fs');
    if(await RNFS.exists(RNFS.DocumentDirectoryPath + '/enters1.txt')){
      await RNFS.unlink(RNFS.DocumentDirectoryPath + '/enters1.txt');
    }
    if(await RNFS.exists(RNFS.DocumentDirectoryPath + '/exits1.txt')){
      await RNFS.unlink(RNFS.DocumentDirectoryPath + '/exits1.txt');
    }
    this.readFiles();
  }
  readFiles = () => {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/enters.txt';
    var path1 = RNFS.DocumentDirectoryPath + '/exits.txt';
    RNFS.readFile(path)
      .then((success) => {
        const res = success.split(`$`);
        RNFS.readFile(path1)
          .then((success1) => {
            const res1 = success1.split(`$`);
            this.sortList(res, 'enters');
            this.sortList(res1, 'exits');
            this.setState({ loading: false });
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  sortList(content, saveTo) {
    var timeStampArray = [];
    content.forEach((item) => {
      if (item != '') {
        timeStampArray.push(Date.parse(item));
      }
    })
    const thesorted = timeStampArray.sort(function (x, y) {
      return x - y;
    });
    var sortedContent = thesorted.map((item) => {
      return (new Date(item));
    })
    sortedContent = sortedContent.reverse();
    if (saveTo == 'enters') {
      this.setState({ entersContent: sortedContent, originEntersContent: sortedContent })
    } else {
      this.setState({ exitsContent: sortedContent, originExitsContent: sortedContent })
    }
  }
  removeRow(index, item) {
    if (this.state.categoryToDisplay == 'enters') {
      var arr = (this.state.entersContent.slice(0, index));
      arr = arr.concat(this.state.entersContent.slice(index + 1));
      this.setState({ entersContentToUpdate: arr, ModalVisible: true });
    }
    else {
      var arr = (this.state.exitsContent.slice(0, index));
      arr = arr.concat(this.state.exitsContent.slice(index + 1));
      this.setState({ exitsContentToUpdate: arr, ModalVisible: true });
    }
  }
  remove() {
    console.log('remove');
    const { exitsContentToUpdate, entersContentToUpdate } = this.state;
    if (this.state.categoryToDisplay == 'enters') {
      this.setState({ entersContent: entersContentToUpdate, ModalVisible: false });
    }
    else {
      this.setState({ exitsContent: exitsContentToUpdate, ModalVisible: false });
    }
  }
  updateRecords() {
    this.setState({ removeModalVisible: false, loading: true })
    console.log('HERE');
    const { categoryToDisplay } = this.state;
    var content = this.state.entersContent;
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/enters1.txt';
    var originath = RNFS.DocumentDirectoryPath + '/enters.txt';
    if (categoryToDisplay != 'enters') {
      path = RNFS.DocumentDirectoryPath + '/exits1.txt';
      originath = RNFS.DocumentDirectoryPath + '/exits.txt';
      content = this.state.exitsContent;
    }
    RNFS.writeFile(path, content.join('$') + `$`, 'utf8')
      .then((success) => {
        RNFS.unlink(originath).then(res => {
          console.log('level1');
          RNFS.moveFile(path, originath).then(res => {
            console.log('level2');
              this.setState({ loading: false })
              ToastAndroid.show("רשומות עודכנו בהצלחה  ", ToastAndroid.LONG);
          })
            .catch(err => {
              console.log(err.message, err.code);
            });
        })
          .catch(err => {
            console.log(err.message, err.code);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });

  }
  setSelectedValue(item) {
    this.setState({ categoryToDisplay: item })
  }
  setModalVisible(event) {
    this.setState({ ModalVisible: event })
  }

  setRemoveModalVisible(event) {
    this.setState({ removeModalVisible: event })
  }
  resetRecrds(){
    const { categoryToDisplay, originEntersContent , originExitsContent} = this.state;
    if (categoryToDisplay == 'enters') {
      this.setState({entersContent: originEntersContent, entersContentToUpdate: originEntersContent})
    } else{
      this.setState({exitsContent: originExitsContent, exitsContentToUpdate: originExitsContent})

    }
  }

  renderEntersExitsPicker() {
    const { categoryToDisplay } = this.state;
    return (
      <Picker
        selectedValue={categoryToDisplay}
        style={{ height: 50, width: 150, alignSelf: 'flex-end' }}
        onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
      >
        <Picker.Item label={'כניסות'} value={'enters'} />
        <Picker.Item label={'יציאות'} value={'exits'} />
      </Picker>
    )
  }
  renderTable() {
    const { entersContent, exitsContent, categoryToDisplay } = this.state;
    const content = categoryToDisplay == 'enters' ? entersContent : exitsContent;
    console.log(content, '++++++++');
    const windowHeight = Dimensions.get('window').height;
    return (
      content.map((item, index) => {
        return (
          <View key={index} style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', borderColor: '#94908B', borderBottomWidth: 1 }}>
            <TouchableOpacity key={index} onPress={event => { this.removeRow(index, item); }}>
              <Image style={styles.deleteIcon} source={require('../images/delete-256.png')} />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', paddingRight: 10 }} >{new Date(item).getHours() + ":" + new Date(item).getMinutes() + '   ' + new Date(item).getDate() + '-' + (new Date(item).getMonth() + 1) + '-' + new Date(item).getFullYear()}</Text>
          </View>
        )
      })
    )
  }
  render() {
    const { loading, ModalVisible, categoryToDisplay, removeModalVisible } = this.state;
    const windowHeight = Dimensions.get('window').height;
    return (
      <View style={styles.container}>
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
                <Text style={styles.modalText}>{'מחיקה'}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableHighlight style={styles.cancelButton} onPress={() => { this.setModalVisible(false); }} >
                  <Text style={styles.cancelTextStyle}>ביטול</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.enterExitButton} onPress={() => {
                  this.remove();
                }} >
                  <Text style={styles.textStyle}>מחיקה</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={removeModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={styles.modalText}>{'למחוק רשומות?'}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableHighlight style={styles.cancelButton} onPress={() => { this.setRemoveModalVisible(false); }} >
                  <Text style={styles.cancelTextStyle}>ביטול</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.enterExitButton} onPress={() => {
                  this.updateRecords();
                }} >
                  <Text style={styles.textStyle}>מחיקה</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        {loading && <View style={{ padding: 10, zIndex: 2, position: 'absolute', alignSelf: "center" }}>
          <ActivityIndicator size="large" color="black" />
        </View>}
        {!loading && <>
          <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: windowHeight * 0.85 }}>
            <View style={{ display: 'flex', height: windowHeight * 0.77 }}>
              <View style={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => { this.resetRecrds(); }}>
                  <Image style={styles.deleteIcon} source={require('../images/arrow-87-256.png')} />
                </TouchableOpacity>
                {this.renderEntersExitsPicker()}
              </View>
              <ScrollView >
                {this.renderTable()}
              </ScrollView>
            </View>
            <View style={{ display: 'flex' }}>

              {categoryToDisplay == 'enters' && <TouchableHighlight style={styles.updateButton} onPress={() => { this.setRemoveModalVisible(true); }} >
                <Text style={styles.updateTextStyle}>עדכן רשימת כניסות</Text>
              </TouchableHighlight>}
              {categoryToDisplay != 'enters' && <TouchableHighlight style={styles.updateButton} onPress={() => { this.setRemoveModalVisible(true); }} >
                <Text style={styles.updateTextStyle}>עדכן רשימת יציאות</Text>
              </TouchableHighlight>}
            </View>
          </View>

        </>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFE4C4',
    padding: 20
  },
  deleteIcon: {
    width: 20,
    height: 20,
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
  updateButton: {
    backgroundColor: "#090F0F",
    borderRadius: 5,
    paddingVertical: 10,
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
  updateTextStyle: {
    color: "#FFE4C4",
    fontWeight: "bold",
    textAlign: "center"
  },
});
export default EditRecordsScreen;