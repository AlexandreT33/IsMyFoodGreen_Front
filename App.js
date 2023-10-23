import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import QR_Scanner from './src/tools/Scanner'

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);

    function returnButtonTitle(){
        let buttonTitle = "Ouvrir le scanner"

        if (showQrScanner === true) 
        {
            buttonTitle = "Fermer le scanner"
        }

        return buttonTitle
    }

  return (
    <View style={styles.container}>
        {showQrScanner === true ? <QR_Scanner/> : <Text></Text>}
        <Button
            title={returnButtonTitle()}
            color="#f194ff"
            onPress={() => {setshowQrScanner(!showQrScanner)}}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
