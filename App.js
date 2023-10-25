import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import QR_Scanner from './src/tools/Scanner'
import PieChart from 'react-native-pie-chart'

const logo = require('./assets/logo.png');

export default function App() {
    const [showQrScanner, setshowQrScanner] = useState(false);
    const [scanValue, setScanValue] = useState(null);
    const [productInfo, setproductInfo] = useState(null);
    const [scoreStyle, setScoreStyle] = useState(null);
    const [scoreClass, setScoreClass] = useState("Undefined");
    const [pieCharList, setPieChartList] = useState([200,300,400,500,100, 2]);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageWidth = (windowWidth * 50) / 100;
    const imageHeight = (windowHeight * 25) / 100;

    const logoWidth = (windowWidth * 120) / 100;
    const logoHeight = (windowHeight * 60) / 100;

    const widthAndHeight = 200
    const sliceColor = ['#ff8000', '#ffff00', '#ff0000', '#00ff00', '#00ffff',  '#8000ff']

    useEffect(() => {
        if (scanValue != null) {
            fetchBarCodeData(scanValue);
            setshowQrScanner(false);
        }
    }, [scanValue]);

    useEffect(() => {
        if (productInfo != null) {
            switch (true) {
                case undefined:
                    setScoreStyle(styles.undefined);
                    productInfo.co2_total = 0;
                    setScoreClass("Inconnu");
                    break;
                case productInfo?.co2_total < 1:
                    setScoreStyle(styles.exellent);
                    setScoreClass("Excellent !")
                    break;
                case productInfo?.co2_total < 2.5:
                    setScoreStyle(styles.very_good);
                    setScoreClass("Très bien")
                    break;
                case productInfo?.co2_total < 5:
                    setScoreStyle(styles.good);
                    setScoreClass("Bien")
                    break;
                case productInfo?.co2_total < 7.5:
                    setScoreStyle(styles.average);
                    setScoreClass("Moyen");
                    break;
                case productInfo?.co2_total < 11.25:
                    setScoreStyle(styles.bad);
                    setScoreClass("Mauvais");
                    break;
                case productInfo?.co2_total < 15:
                    setScoreStyle(styles.very_bad);
                    setScoreClass("Très mauvais")
                    break;
            }
        }
    }, [productInfo]);

    async function fetchBarCodeData(barcodeValue) {
        try 
        {
            const response = await fetch(`https://81c0-2a01-cb01-306f-50a8-7fa6-e669-6ea-a4db.ngrok.io/products/${barcodeValue}`);
            const jsonData = await response.json();

            setproductInfo({
                abbreviated_product_name: jsonData?.abbreviated_product_name_fr,
                generic_name: jsonData?.generic_name,
                brands: jsonData?.brands,
                images_url: jsonData?.images?.display?.fr,
                co2_total: jsonData?.eco?.agribalyse?.co2_total?.toFixed(2),
            });

            console.log("ICICICICICICI : " + productInfo.co2_total)

            if (productInfo.co2_total == undefined) {
                setScoreClass("Inconnu");
                setScoreStyle(styles.undefined);
            }

            setPieChartList([
                jsonData?.eco?.agribalyse?.co2_agriculture,
                jsonData?.eco?.agribalyse?.co2_consumption,
                jsonData?.eco?.agribalyse?.co2_distribution,
                jsonData?.eco?.agribalyse?.co2_packaging,
                jsonData?.eco?.agribalyse?.co2_processing,
                jsonData?.eco?.agribalyse?.co2_transportation
            ])
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
                                alignSelf: 'center'
                            }}
                    />
                    <Text style={styles.text} >Nom : {productInfo?.generic_name}</Text>
                    <Text style={styles.text} >Marque : {productInfo?.brands}</Text>
                    <Text style={[styles.score, scoreStyle]}>{scoreClass}</Text>
                    <Text style={styles.smallText}>{productInfo?.co2_total} kg CO2 eq/kg de produit</Text>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: 20
                    }}>
                        <PieChart
                            widthAndHeight={widthAndHeight}
                            series={pieCharList}
                            sliceColor={sliceColor}
                            coverRadius={0.50}
                            coverFill={'#FFF'}
                            style={styles.pieChart}
                        />
                        <View style={{
                            flexDirection: 'column'
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#ff8000", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Agriculture</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#ffff00", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Consommation</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#ff0000", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Distribution</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#00ff00", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Packaging</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#00ffff", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Processing</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 10, width: 10, backgroundColor:"#8000ff", alignSelf:'center', marginLeft: 10}}/>
                                <Text style={styles.text} >Transport</Text>
                            </View>
                        </View>
                    </View>
                    
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
    pieChart: {
        marginTop: 10,
        alignSelf: 'center'
    },
    smallText: {
        fontSize: 15,
        alignSelf: 'center'
    },
    score: {
        fontSize: 40,
        marginTop: 10,
        alignSelf: 'center'
    },
    undefined: {
        color: '#adadad',
        fontWeight: 'bold',
    },
    exellent: {
        color: '#03ff20',
        fontWeight: 'bold',
    },
    very_good: {
      color: '#11f788',
      fontWeight: 'bold',
    },
    good: {
      color: '#27b4f5',
      fontWeight: 'bold',
    },
    average: {
      color: '#f5cd02',
      fontWeight: 'bold',
    },
    bad: {
      color: '#f59402',
      fontWeight: 'bold',
    },
    very_bad: {
      color: '#f51302',
      fontWeight: 'bold',
    },
    text: {
        margin: 3,
        fontWeight: 'bold',
        alignSelf: 'center'
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
    }
});


