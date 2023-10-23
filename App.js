import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import QR_Scanner from './src/tools/Scanner'

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);
    const [scanValue, setScanValue] = useState(null);

    useEffect(() => {
        if (scanValue != null) {
            alert(`COUCOU ${scanValue}`);
            setshowQrScanner(false);
        }
        
      }, [scanValue]);

    function returnButtonTitle(){
        let buttonTitle = "Ouvrir le scanner"

        if (showQrScanner === true) 
        {
            buttonTitle = "Fermer le scanner"
        }

        return buttonTitle
    }

  return (
    
    <View style={{flex:1}}>
        <View style={styles.topbox}>
            {showQrScanner === true ? <QR_Scanner setScanValue={setScanValue} /> : <></>}
        </View>

        <View style={styles.bottombox}>
            
            <Button
                title={returnButtonTitle()}
                color="#f194ff"
                onPress={() => {setshowQrScanner(!showQrScanner)}}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topbox: {
    backgroundColor: '#00FF00',
    flex: 15
  },
  bottombox: {
    backgroundColor: '#FFFF00',
    flex: 1,
    padding: 20,
  }
});
