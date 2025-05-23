import React from 'react';
import { Dimensions, Text, useWindowDimensions, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get('window').width;

type Props = {
    totalQuantity: number;
    blueQuantity: number;
    greenQuantity: number;
    redQuantity: number;
    submitted: number;
    title: string;
};

const Linechart = ({ totalQuantity, blueQuantity, greenQuantity, redQuantity, submitted, title }: Props) => {
  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
    
  const pieData = [
  {
    value: totalQuantity,
    color: '#A9A9A9',
    gradientCenterColor: '#006DFF',
    focused: true,
  },
  {value: blueQuantity-greenQuantity, color: '#0072C8', gradientCenterColor: '#3BE9DE'},//синие
  {value: greenQuantity, color: '#16a34a', gradientCenterColor: '#8F80F3'},//динамика
  {value: redQuantity, color: '#E24831', gradientCenterColor: '#FF7F97'},//отставание
  
];
 const lineData = [
      {value: 0, dataPointText: '0', label: '30.04', },
      {value: 20, dataPointText: '20', label: '07.05'},
      {value: 18, dataPointText: '18', label: '14.05'},
      {value: 40, dataPointText: '40', label: '21.05', dataPointRadius: 5, dataPointColor: 'red', dataPointLabelWidth: 1},
      {value: 36, dataPointText: '36', label: '29.05'},
      {value: 60, dataPointText: '60', label: '05.05'},
      {value: 54, dataPointText: '54', label: '12.05'},
  ];

/*  stackData.forEach(stackItem => {
    stackItem.topLabelComponent = () => (
      <Text>
        {stackItem.stacks.map(stack => stack.value).reduce((v, a) => v + a)}
      </Text>
    );
  });*/

 const barData = [{value: 5}, {value: 5}];
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
          width: '90%',
          alignSelf: 'center',
         // backgroundColor: 'green',
          height: 85,
         marginTop: -95.5,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',}}>
           {/* {renderDot('#8F80F3')}*/}
          <Text style={{color: '#0072C8', fontSize: ts(16.7), alignSelf: 'flex-end'}}>{blueQuantity} </Text>{/** здесь над подставить вычисленную сумму green+blue */}
          <Text style={{ fontSize: ts(9.3), alignSelf: 'flex-end'}}>снято</Text>
        </View>
        <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',}}>
         {/* {renderDot('#006DFF')}*/}
          <Text style={{color: '#A9A9A9', fontSize: ts(16.7), alignSelf: 'flex-end'}}>{totalQuantity-blueQuantity} </Text>{/** здесь над подставить вычисленную разницу */}
          <Text style={{ fontSize: ts(9.3), alignSelf: 'flex-end'}}>осталось</Text>
        </View>
       
      </View>

    </>
  );
};
  return (
 
   
 <View style={{ flex: 1, }}>
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
        backgroundColor: '#F2F2F2',//'#F2F2F2'
        height: 105,
        
      }}>
 <View style={{  height: 90, alignSelf: 'flex-end',  width: 250}}>
  {/**marginTop: -6, marginLeft: -50 
   * justifyContent: 'flex-end',marginLeft: -46
  */}
          <LineChart
              initialSpacing={15}
              data={lineData}
              
              textColor1="black"
              width={230}
              height={65}
              stepValue={8}
              adjustToWidth={true}
             // dataPointLabelWidth={0}
              //stepHeight={}

              textShiftY={-5}
              textShiftX={-7}
              textFontSize={13}
              //thickness={5}
              hideRules
              hideYAxisText={true}

              hideAxesAndRules={true}//скрывает оси
              
              //spacing={35}//расстояние между метками
              showXAxisIndices
              xAxisIndicesHeight={1}
              xAxisIndicesWidth={250}
              xAxisColor={'gray'}
              xAxisIndicesColor={'red'}

              xAxisLabelTextStyle={{
                fontSize: 10,
                color: 'gray',
                //fontFamily: 'Arial'
              }}

              //spacing1={30}//расстояние между точками
              yAxisColor="#0BA5A4"
             // showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              color="skyblue"
             // curved={true}
              //hideOrigin={true}

          />
          </View>
     </View>

    </View></View>



  ); 
}

export default Linechart;