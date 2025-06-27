import { Image } from 'expo-image';
import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";


type Props = {
    totalQuantity: number;
    blueQuantity: number;
    greenQuantity: number;
    redQuantity: number;
    submitted: number;
    title: string;
};

const PiechartBig = ({ totalQuantity, blueQuantity, greenQuantity, redQuantity, submitted, title }: Props) => {
  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  console.log( totalQuantity, blueQuantity, greenQuantity, redQuantity)
    
  const pieData = [
  {
    //value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (greenQuantity===0 && blueQuantity===0)? (totalQuantity-redQuantity): (greenQuantity!=0)? (blueQuantity==0)? (totalQuantity-redQuantity-greenQuantity): (totalQuantity-redQuantity-greenQuantity-blueQuantity) : (blueQuantity!=0)? (greenQuantity===0)? (totalQuantity-redQuantity-blueQuantity) : (totalQuantity-redQuantity-greenQuantity-blueQuantity) : 0,
    //value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (greenQuantity===0 && blueQuantity===0)? (totalQuantity-redQuantity): (greenQuantity!=0)? (blueQuantity==0)? (totalQuantity-redQuantity-greenQuantity): (totalQuantity-redQuantity-greenQuantity-blueQuantity) : (blueQuantity!=0)? (greenQuantity===0)? (totalQuantity-redQuantity-blueQuantity) : (totalQuantity-redQuantity-greenQuantity-blueQuantity) : 0,
    //value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (greenQuantity===0 && blueQuantity===0)? (totalQuantity-redQuantity): (greenQuantity!=0)? (blueQuantity==0)? (totalQuantity-redQuantity-greenQuantity): (totalQuantity-redQuantity-greenQuantity-blueQuantity) : (blueQuantity!=0)? (greenQuantity===0)? (totalQuantity-redQuantity-blueQuantity) : (totalQuantity-redQuantity-greenQuantity-blueQuantity) : 0,
    //value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity && redQuantity===0)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity),
    //вроде верный, но что-то не так value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity && redQuantity===0)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity),
    //value: (totalQuantity===0 )? 1: (greenQuantity!=0 && blueQuantity!=0)? (greenQuantity!=blueQuantity)? (totalQuantity-blueQuantity-greenQuantity-redQuantity) : (totalQuantity-blueQuantity-redQuantity) : (totalQuantity-redQuantity),
    value: (totalQuantity===0 && blueQuantity===0 && redQuantity===0)? 1: totalQuantity-blueQuantity-redQuantity,
    color: (totalQuantity===0 && blueQuantity===0 && redQuantity===0 && greenQuantity===0)? 'white' : '#A9A9A9',
    gradientCenterColor: '#006DFF',
    focused: true,
  },
  {value: blueQuantity-greenQuantity, color: '#0072C8', gradientCenterColor: '#3BE9DE'},//синие
  {value: greenQuantity, color: '#16a34a', gradientCenterColor: '#8F80F3'},//динамика
  {value: redQuantity, color: '#E24831', gradientCenterColor: '#FF7F97'},//отставание
  
];

function countPositiveValues(pieData) {
  return pieData.filter(item => item.value > 0).length;
}

console.log('countPositiveValues',countPositiveValues(pieData));

const renderDot = color => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = () => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center',height: 20, width: '50%'}}>
         {/* {renderDot('#006DFF')}*/}
          <Text style={{color: '#A9A9A9', fontSize: ts(16.7), alignSelf: 'flex-end'}}>{totalQuantity-blueQuantity} </Text>{/** здесь над подставить вычисленную разницу */}
          <Text style={{ fontSize: ts(9.3), alignSelf: 'flex-end'}}>осталось</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center',  height: 20, width: '50%'}}>
           {/* {renderDot('#8F80F3')}*/}
          <Text style={{color: '#2FB4E9', fontSize: ts(16.7), alignSelf: 'flex-end'}}>{submitted} </Text>{/** здесь над подставить вычисленную сумму green+blue */}
          <Text style={{ fontSize: ts(9.3), alignSelf: 'flex-end'}}>проведены</Text>
        </View>
      </View>

    </>
  );
};
  return (
 
   
 <View style={{ flex: 1}}>
    <View>
     <View style={{}}>
        <Text style={{color: '#1A4072', fontSize: ts(16), fontWeight: 'bold', alignSelf: 'center' }}>
            {title}
        </Text>
     </View>
    <View
      style={{
        padding: ts(10),
        borderRadius: 20,
        borderColor: '#1A4072',
        borderWidth: 2,
        backgroundColor: '#F2F2F2',
        
      }}>
      
      <View style={{padding: 2, alignItems: 'center'}}>
        <PieChart
          data={pieData}
          donut
          //showGradient
          //sectionAutoFocus
          radius={70}
          //semiCircle={true} // делит круг пополам
          //showTooltip={true} //показывает значение сегмента при нажатии
          innerRadius={50}
          innerCircleColor={'#F2F2F2'}
          innerCircleBorderWidth={2}
          strokeWidth={2}
          strokeColor="white"
          innerCircleBorderColor="white"
          initialAngle={
            //-1.5708}
            totalQuantity-blueQuantity-redQuantity<=0 || totalQuantity-blueQuantity-redQuantity===totalQuantity? 0:
           // 0}
          /* countPositiveValues(pieData) === 2? 
           (360/180*3.157/((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157)*180/3.157-((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157 - 1.5*2/180*3.157 :
           countPositiveValues(pieData) === 3? 
           (360/180*3.157/((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157)*180/3.157-((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157 - 1.56/180*3.157 :
           countPositiveValues(pieData) === 4? 
           (360/180*3.157/((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157)*180/3.157-((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.157 - 1.5*11/180*3.157 
          : 0
          }*/
             //(360/180*3.1565/((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.1565)*180/3.1565-((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*3.1565}
            (360/180*Math.PI/((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*Math.PI)*180/Math.PI-((totalQuantity-blueQuantity-redQuantity)*360/totalQuantity)/180*Math.PI }
          centerLabelComponent={() => {
            return (
              <View style={{flexDirection: 'row'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: ts(30), color: '#0072C8', fontWeight: 'bold'}}>
                    {blueQuantity}
                  </Text>
                  <Text style={{fontSize: ts(9.33), color: '#1A4072'}}>из {totalQuantity}</Text>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <View style={{flexDirection: 'row', height: 24, marginBottom: -5.5,}}>
                    <View style={{ alignSelf: 'flex-end', marginRight: -5  }}>
                    <Image 
                      style={{ width: 24, height: 24, tintColor: '#16a34a', alignItems: 'flex-end' }}
                      source={require('../assets/images/arm.svg')} 
                    />
                    </View>
                    <View style={{ alignSelf: 'flex-start', height: 16}}>
                      <Text
                        style={{fontSize: ts(13.3), color: '#16a34a', fontWeight: '500' }}>
                        {greenQuantity}
                      </Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', height: 24}}>
                    <View style={{ alignSelf: 'flex-end',marginBottom: -0.5, marginRight: -5  }}>
                    <Image 
                      style={{ width: 24, height: 24, tintColor: '#E24831', alignItems: 'flex-end' }}
                      source={require('../assets/images/delta.svg')} 
                    />
                    </View>
                    <View style={{ alignSelf: 'flex-start', height: 16}}>
                      <Text
                        style={{fontSize: ts(13.3), color: '#E24831', fontWeight: '500'  }}>
                        {redQuantity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View></View>

  </View>

  ); 
}

export default PiechartBig;