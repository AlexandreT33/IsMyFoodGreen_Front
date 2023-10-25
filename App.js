import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import QR_Scanner from './src/tools/Scanner'

const logo = require('./assets/logo.png');

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);
    const [scanValue, setScanValue] = useState(null);
    const [productInfo, setproductInfo] = useState(null);
    const [scoreStyle, setScoreStyle] = useState(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageWidth = (windowWidth * 50) / 100;
    const imageHeight = (windowHeight * 25) / 100;

    const logoWidth = (windowWidth * 120) / 100;
    const logoHeight = (windowHeight * 60) / 100;

    useEffect(() => {
        if (scanValue != null) {
            fetchBarCodeData(scanValue);
            setshowQrScanner(false);
        }
        
    }, [scanValue]);

    useEffect(() => {
        if (productInfo != null) {
            console.log(productInfo);
            
            switch (true) {
                case null:
                    setScoreStyle(styles.undefined);
                    productInfo.co2_total = "Undefined";
                    break;
                case productInfo?.co2_total < 1:
                    setScoreStyle(styles.exellent);
                    break;
                case productInfo?.co2_total < 2.5:
                    setScoreStyle(styles.very_good);
                    break;
                case productInfo?.co2_total < 5:
                    setScoreStyle(styles.good);
                    break;
                case productInfo?.co2_total < 7.5:
                    setScoreStyle(styles.average);
                    break;
                case productInfo?.co2_total < 11.25:
                    setScoreStyle(styles.bad);
                    break;
                case productInfo?.co2_total < 15:
                    setScoreStyle(styles.very_bad);
                    break;
            }
        }
        
    }, [productInfo]);

    async function fetchBarCodeData(barcodeValue) {
        try 
        {
            const response = await fetch(`https://20cb-2a01-cb01-306f-50a8-aa0-c1d0-6841-80d7.ngrok.io/products/${barcodeValue}`);
            const jsonData = await response.json();
            
            let scoreCO2 = jsonData?.eco?.agribalyse?.co2_total;
            scoreCO2 = scoreCO2.toFixed(2);

            console.log(scoreCO2);

            setproductInfo({
                abbreviated_product_name: jsonData?.abbreviated_product_name_fr,
                generic_name: jsonData?.generic_name,
                brands: jsonData?.brands,
                images_url: jsonData?.images?.display?.fr,
                co2_total: jsonData?.eco?.agribalyse?.co2_total.toFixed(2),
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
            {showQrScanner === true ? <QR_Scanner setScanValue={setScanValue} /> :  
            <View style={{flex: 1}}>
                { 
                productInfo == null ? 
                <Image
                    source={logo} 
                    style={
                         { 
                            width: logoWidth, 
                            height: logoHeight,
                            marginTop: 50,
                        }}
                    />
                :
                <View style={{flex: 1}}>
                    <Image
                        source={{ uri: `${productInfo?.images_url}` }} // Replace with the URL of your image
                        style={{ 
                                width: imageWidth, 
                                height: imageHeight,
                                margin: 20,
                                marginTop: 50,
                                borderRadius: 10,
                            }}
                    />
                    <Text style={styles.text} >Nom : {productInfo?.generic_name}</Text>
                    <Text style={styles.text} >Marque : {productInfo?.brands}</Text>
                    <Text style={[styles.score, scoreStyle]}>{productInfo?.co2_total}</Text>
                    <Text style={styles.smallText}>kg CO2 eq/kg de produit</Text>
                </View>
                }
            </View>
            }
        </View>

        <View style={styles.bottombox}>
            
            <Button
                title={showQrScanner === true ? "Fermer le scanner" : "Ouvrir le scanner"}
                color="#008080"
                
                onPress={() => {setshowQrScanner(!showQrScanner)}}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    smallText: {
        fontSize: 15,
        alignSelf: 'center'
    },
    score: {
        fontSize: 40,
        marginTop: 45,
        alignSelf: 'center'
    },
    undefined: {
        color: '#adadad',
        fontWeight: 'bold',
    },
    exellent: {
        color: '#17fc03',
        fontWeight: 'bold',
    },
    very_good: {
      color: '#20f77a',
      fontWeight: 'bold',
    },
    good: {
      color: '#00fbff',
      fontWeight: 'bold',
    },
    average: {
      color: '#adadad',
      fontWeight: 'bold',
    },
    bad: {
      color: '#ff8000',
      fontWeight: 'bold',
    },
    very_bad: {
      color: '#ff0000',
      fontWeight: 'bold',
    },

    text: {
        margin: 3,
        fontWeight: 'bold',
    },
    topbox: {
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
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
