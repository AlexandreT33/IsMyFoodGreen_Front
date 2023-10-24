import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import QR_Scanner from './src/tools/Scanner'

const logo = require('./assets/logo.png');

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);
    const [scanValue, setScanValue] = useState(null);
    const [productInfo, setProductInfo] = useState({});

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageWidth = (windowWidth * 50) / 100;
    const imageHeight = (windowHeight * 25) / 100;

    const logoWidth = (windowWidth * 120) / 100;
    const logoHeight = (windowHeight * 60) / 100;

    let scoreStyle = null;

    useEffect(() => {
        if (scanValue != null) {
            fetchBarCodeData(scanValue);
            setshowQrScanner(false);
        }
        
    }, [scanValue]);

    async function fetchBarCodeData(barcodeValue) {
        try 
        {
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

            switch (productInfo.co2_total) {
                case null:
                    scoreStyle = styles.undefined;
                    productInfo.co2_total = "Undefined";
                    break;
                case productInfo.co2_total < 100:
                    scoreStyle = styles.exellent;
                    break;
                case productInfo.co2_total < 500:
                    scoreStyle = styles.very_good;
                    break;
                case productInfo.co2_total < 1000:
                    scoreStyle = styles.good;
                    break;
                case productInfo.co2_total < 2000:
                    scoreStyle = styles.average;
                    break;
                case productInfo.co2_total < 3000:
                    scoreStyle = styles.bad;
                    break;
                case productInfo.co2_total < 4000:
                    scoreStyle = styles.very_bad;
                    break;
            }
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
                { productInfo !== null ? 
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
                            source={{ uri: "https://images.openfoodfacts.org/images/products/306/832/012/4377/front_en.3.400.jpg" }} // Replace with the URL of your image
                            style={
                                { 
                                    width: imageWidth, 
                                    height: imageHeight,
                                    margin: 20,
                                    marginTop: 50,
                                    borderRadius: 10,
                                }}
                        />
                        <Text style={styles.text} >Nom : {productInfo.generic_name}</Text>
                        <Text style={styles.text} >Marque : {productInfo.brands}</Text>
                        <Text style={[styles.score, scoreStyle]}>{productInfo.co2_total}</Text>
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
    score: {
        fontSize: 20,
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
