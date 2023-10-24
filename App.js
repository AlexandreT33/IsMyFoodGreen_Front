import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import QR_Scanner from './src/tools/Scanner'

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);
    const [scanValue, setScanValue] = useState(null);
    const [productInfo, setProductInfo] = useState({});

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageWidth = (windowWidth * 50) / 100;
    const imageHeight = (windowHeight * 25) / 100;

    useEffect(() => {
        if (scanValue != null) {
            
            fetchBarCodeData(scanValue);      
            setshowQrScanner(false);
        }
        
    }, [scanValue]);

    async function fetchBarCodeData(barcodeValue) {
        try 
        {
            alert(`COUCOU ${barcodeValue}`);
            const response = await fetch(`https://a070-2a01-cb01-307f-c3aa-526e-b7d5-9e84-30b1.ngrok.io/products/${barcodeValue}`);
            const jsonData = await response.json();
            console.log(jsonData);
        
              setProductInfo({
                abbreviated_product_name: jsonData?.abbreviated_product_name_fr,
                generic_name: jsonData?.generic_name,
                brands: jsonData?.brands,
                images_url: jsonData?.images?.display?.fr,
                co2_total: jsonData?.eco?.agribalyse?.co2_total,
              });
        }
        catch (error) 
        {
          console.error('Erreur lors de la récupération des données :', error);
        }
    }

  return (
    
    <View style={{flex:1}}>
        <View style={styles.topbox}>
            
            {showQrScanner === true ? <QR_Scanner setScanValue={setScanValue} /> : <></> }
            <View style={
                { 
                    width: imageWidth, 
                    height: imageHeight,
                    margin: 20,
                    marginTop: 50,

                }}>
                <Image
                    source={{ uri: "https://images.openfoodfacts.org/images/products/306/832/012/4377/front_en.3.400.jpg" }} // Replace with the URL of your image
                    style={{ flex:1 }}
                />
            </View>
            

        </View>

        <View style={styles.bottombox}>
            {productInfo === null ? <></> : <Text>Brand: {productInfo.brands}</Text> }
            <Button
                title={showQrScanner === true ? "Ouvrir le scanner": "Fermer le scanner"}
                color="#008080"
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
  topbox_img: {
    flex: 1,
    margin: 20,
  },
  bottombox: {
    backgroundColor: '#2E2E2E',
    flex: 1,
    padding: 20,
  }
});
