import React from 'react';
import { View, Button } from 'react-native';

class Navigator extends React.Component {
  render() {
    return (
      <View>
        <Button
          title="Home"
          onPress={() =>
            this.props.navigation.navigate('Home')
          }
        />
        <Button
          title="Friends"
          onPress={() =>
            this.props.navigation.navigate('Friends')
          }
        />
      </View>
    );
  }
}

// ...

export default Navigator;