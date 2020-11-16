import React from 'react';
import { Text, View, Modal, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity,Picker, Dimensions, TextInput, TouchableHighlight, Image } from 'react-native';
import { DataTable, Divider } from 'react-native-paper';

class TrackScreen extends React.Component {
  state = {
    jsonEntersContent: [],
    jsonExitsContent: [],
    currentEntersList: [],
    currentExitsList: [],
    allMonthes: [],
    selectedMonth: ((new Date()).getMonth() + 1) + '-' + (new Date()).getFullYear(),
    value: 0,
    hourlyRate: 0,
    dailyRate: 0,
    dailyHours: 0,
    dailyHoursFriday: 0,
    overTimeSalary: 0,
    dailySalary: 0,
    salary: 0,
    calculaterLoading: false,
    ModalVisible: false
  };
  constructor() {
    super();
  }
  componentDidMount() {
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
            this.setState({ loading: false, jsonEntersContent: this.listToJson(res), jsonExitsContent: this.listToJson(res1) });
            this.setSelectedValue(this.state.selectedMonth);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  listToJson(content) {
    const timeStampArray = content.map((item) => {
      return (Date.parse(item));
    })
    const thesorted = timeStampArray.sort(function (x, y) {
      return x - y;
    });
    const sortedContent = thesorted.map((item) => {
      return (new Date(item));
    })
    this.setState({ entersContent: sortedContent });
    var currentdate = (sortedContent[0].getMonth() + 1) + '-' + sortedContent[0].getFullYear();
    var list = [];
    var mapCurrentdate = (sortedContent[0].getMonth() + 1) + '-' + sortedContent[0].getFullYear();
    const jsonArray = {};
    sortedContent.map((item) => {
      mapCurrentdate = (item.getMonth() + 1) + '-' + item.getFullYear();
      if (currentdate == mapCurrentdate) {
        var m_date = item.getDate().toString();
        var m_time = item.getHours() + "-" + item.getMinutes();
        var itemToList = `{"${m_date}": "${m_time}"}`;
        list.push(JSON.parse(itemToList));
      } else {
        const savedList = list;
        const itemToReturn = (JSON.parse(`{"${currentdate}": "-"}`));
        itemToReturn[currentdate] = savedList;
        list = [];
        var m_date = item.getDate().toString();
        var m_time = item.getHours() + "-" + item.getMinutes();
        var itemToList = `{"${m_date}": "${m_time}"}`;
        list.push(JSON.parse(itemToList));
        jsonArray[`${currentdate}`] = savedList;
        currentdate = mapCurrentdate;
      }
    });
    var allMonthes = Object.keys(jsonArray);
    allMonthes.reverse();
    this.setState({ allMonthes })
    return jsonArray;
  }

  dateToDisplayDate(item, index) {
    const time = new Date(item);
    return (<Text key={index}>{time.getDate() + '-' + (time.getMonth() + 1) + '-' + time.getFullYear() + '   ' + time.getHours() + ":" + time.getMinutes()}</Text>);
  }
  setSelectedValue(item) {
    this.setState({
      currentEntersList: this.state.jsonEntersContent[item.toString()] ? this.state.jsonEntersContent[item.toString()] : [],
      currentExitsList: this.state.jsonExitsContent[item.toString()] ? this.state.jsonExitsContent[item.toString()] : [],
      selectedMonth: item,
      salary: 0
    });
  }
  renderPicker() {
    const { selectedMonth, allMonthes } = this.state;
    return (
      <Picker
        selectedValue={selectedMonth}
        style={{ height: 50, width: 150, alignSelf: 'flex-end' }}
        onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
      >
        {allMonthes.map((item, index) => {
          return (
            <Picker.Item key={index} label={item} value={item} />
          )
        })}
      </Picker>
    )
  }
  calculateTime(start, end) {
    if (!start || !end) {
      return '-'
    }
    const indexEnd = end.indexOf('-');
    const indexStart = start.indexOf('-');
    const time1 = new Date();
    const time2 = new Date();
    time1.setHours(Number(end.substr(0, indexEnd)));
    time1.setMinutes(Number(end.substr(indexEnd + 1)));
    time2.setHours(Number(start.substr(0, indexStart)));
    time2.setMinutes(Number(start.substr(indexStart + 1)));
    const diff = time1.getTime() - time2.getTime();
    if (diff < 0) {
      return '?';
    }
    const diffMinutes = Math.floor((diff / 1000) / 60);
    var num = diffMinutes;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + ':' + rminutes;
  }
  calculateMinutes(start, end) {
    if (!start || !end) {
      return 0
    }
    const indexEnd = end.indexOf('-');
    const indexStart = start.indexOf('-');
    const time1 = new Date();
    const time2 = new Date();
    time1.setHours(Number(end.substr(0, indexEnd)));
    time1.setMinutes(Number(end.substr(indexEnd + 1)));
    time2.setHours(Number(start.substr(0, indexStart)));
    time2.setMinutes(Number(start.substr(indexStart + 1)));
    const diff = time1.getTime() - time2.getTime();
    if (diff < 0) {
      return 0;
    }
    return Math.floor((diff / 1000) / 60);
  }
  renderTable() {
    const { currentEntersList, currentExitsList } = this.state;
    var entersJson = {};
    currentEntersList.forEach((item) => {
      entersJson[`${Object.keys(item)}`] = item[Object.keys(item)];
    });
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    return (
      <DataTable style={{ color: 'red', backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 20, width: windowWidth }}>
        <DataTable.Header >
          <DataTable.Title numeric>מס' שעות </DataTable.Title>
          <DataTable.Title numeric>שעת יציאה</DataTable.Title>
          <DataTable.Title numeric> שעת כניסה</DataTable.Title>
          <DataTable.Title numeric>תאריך</DataTable.Title>
        </DataTable.Header>
        <ScrollView style={{ height: windowHeight * 0.6 }}>
          {currentExitsList.map((item, index) => {
            return (
              <DataTable.Row key={index}>
                <DataTable.Cell numeric>{this.calculateTime(entersJson[Object.keys(item)], item[Object.keys(item)])}</DataTable.Cell>
                <DataTable.Cell numeric>{item[Object.keys(item)]}</DataTable.Cell>
                <DataTable.Cell numeric>{entersJson[Object.keys(item)]}</DataTable.Cell>
                <DataTable.Cell numeric>{Object.keys(item)}</DataTable.Cell>
              </DataTable.Row>
            )
          })}
        </ScrollView >
      </DataTable>
    )
  }
  onChangeText(text) {
    this.setState({ value: text })
  }
  onChangeDailyHours(text) {
    this.setState({ dailyHours: text })
  }
  onChangeDailyRate(text) {
    this.setState({ dailyRate: text })
  }
  onChangeHourlyRate(text) {
    this.setState({ hourlyRate: text })
  }
  onChangeDailyHoursFriday(text) {
    this.setState({ dailyHoursFriday: text })
  }
  calculateSalary() {
    this.setState({ calculaterLoading: true });
    const { currentEntersList, currentExitsList, dailyHoursFriday, hourlyRate, dailyRate, dailyHours, selectedMonth } = this.state;
    var entersJson = {};
    var overTimeSalary = 0;
    var dailySalary = 0;
    var salary = 0;
    const salaryPerMinutes = hourlyRate / 60;
    currentEntersList.forEach((item) => {
      entersJson[`${Object.keys(item)}`] = item[Object.keys(item)];
    });
    var minutes = 0;
    var splitedDate = '';
    var currentDate = '';
    currentExitsList.forEach((item) => {
      splitedDate = selectedMonth.split("-");
      currentDate = new Date();
      currentDate.setDate(Object.keys(item));
      currentDate.setMonth(splitedDate[0] - 1);
      currentDate.setYear(splitedDate[1]);
      minutes = this.calculateMinutes(entersJson[Object.keys(item)], item[Object.keys(item)]);
      if (currentDate.getDay() == 5 && minutes > dailyHoursFriday * 60) {
        overTimeSalary += parseInt((minutes - dailyHoursFriday * 60) * salaryPerMinutes);
      }
      if (currentDate.getDay() != 5 && minutes > dailyHours * 60) {
        overTimeSalary += parseInt((minutes - dailyHours * 60) * salaryPerMinutes);
      }
      dailySalary += parseInt(dailyRate);
    });
    salary = dailySalary + overTimeSalary;
    this.setState({ overTimeSalary, dailySalary, salary });
    this.setState({ calculaterLoading: false, ModalVisible: true });

  }
  render() {
    const windowWidth = Dimensions.get('window').width;
    const { loading, calculaterLoading, ModalVisible, overTimeSalary ,salary, dailySalary } = this.state;
    console.log(overTimeSalary ,salary, dailySalary, '---');
    return (
      <View style={styles.container}>
        {loading && <View style={{ padding: 10, zIndex: 2, position: 'absolute', alignSelf: "center" }}>
          <ActivityIndicator size="large" color="black" />
        </View>}
        {!loading && <>
          <View style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={ModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }} >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { this.setState({ModalVisible: false}); }}>
                    <Image style={styles.closeIcon} source={require('../images/close-window-128.png')} />
                  </TouchableOpacity>
                  <View style={{paddingHorizontal: 25, paddingVertical: 25}}>
            <Text style={styles.modalText}> {'שכר עבור יומיות'} {dailySalary} </Text>
            <Text style={styles.modalText}> {'שכר עבור שעות נוספות'} {overTimeSalary}</Text>
            <Text style={styles.modalText}> {'סה"כ שכר'} {salary} </Text>
                  </View>
                  
                </View>
              </View>
            </Modal>
            <View style={{ display: 'flex', flexDirection: 'column', marginHorizontal: 10 }}>
              <TextInput
                placeholder="תעריף יומי"
                style={{ height: 40, width: windowWidth * 0.45, borderColor: 'gray', borderBottomWidth: 1, padding: 0 }}
                onChangeText={text => this.onChangeDailyRate(text)}
                keyboardType='numeric'
              />
              <TextInput
                placeholder="תעריף שעתי (שעות נוספות)"
                style={{ height: 40, width: windowWidth * 0.45, borderColor: 'gray', borderBottomWidth: 1 }}
                onChangeText={text => this.onChangeHourlyRate(text)}
                keyboardType='numeric'
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', marginRight: 10 }}>
              <TextInput
                placeholder="מס' שעות עבודה ליום"
                style={{ height: 40, width: windowWidth * 0.45, borderColor: 'gray', borderBottomWidth: 1 }}
                onChangeText={text => this.onChangeDailyHours(text)}
                keyboardType='numeric'
              />
              <TextInput
                placeholder=" מס' שעות עבודה ליום שישי"
                style={{ height: 40, width: windowWidth * 0.45, borderColor: 'gray', borderBottomWidth: 1 }}
                onChangeText={text => this.onChangeDailyHoursFriday(text)}
                keyboardType='numeric'
              />
            </View>

          </View>
          <TouchableHighlight disabled={calculaterLoading} style={styles.calculateButton} onPress={() => { this.calculateSalary(); }} >
            <>
              {!calculaterLoading && <Text style={styles.updateTextStyle}>{' חשב שכר חודשי'}</Text>}
              {calculaterLoading && <ActivityIndicator size="small" color="#FFE4C4" />}
            </>
          </TouchableHighlight>
          <Divider />

          <View style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            {this.renderPicker()}
          </View>
          <Divider />
          {this.renderTable()}
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
    paddingVertical: 20
  },
  closeIcon: {
    width: 25,
    height: 25,
    margin: 10
  },
  updateTextStyle: {
    color: "#FFE4C4",
    fontWeight: "bold",
    textAlign: "center"
  },
  calculateButton: {
    backgroundColor: "#090F0F",
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 15,
    // elevation: 2,
    margin: 15,
    // width: 100
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "flex-end",
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
});
export default TrackScreen;