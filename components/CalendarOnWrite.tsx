import { format } from 'date-fns';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ],
  monthNamesShort: [
    'Янв.',
    'Фев.',
    'Мар.',
    'Апр.',
    'Май',
    'Июн.',
    'Июл.',
    'Авг.',
    'Сен.',
    'Окт.',
    'Ноя.',
    'Дек.'
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня'
};
LocaleConfig.defaultLocale = 'ru';

type Props = {
  theme?: 'min';
  onChange: (dateString: string) => void;
};

const CalendarOnWrite = ({ theme, onChange }: Props) => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    setDate(selectedDate);
    setShowCalendar(false);
    const formattedDate = format(selectedDate, 'dd.MM.yyyy');
    onChange(formattedDate);
  };

  const formatDate = (date) => {
    return format(date, 'dd.MM.yyyy');
  };

  const showCalendarModal = () => {
    setShowCalendar(true);
  };

  const markedDates = {
    [format(date, 'yyyy-MM-dd')]: {
      selected: true,
      selectedColor: '#0072C8'
    }
  };

  if (theme === 'min') {
    return (
      <View style={styles.containerrowMin}>
        <TextInput
          style={[styles.inputMin, { fontSize: ts(14) }]}
          placeholderTextColor="#111"
          value={formatDate(date)}
          editable={false}
        />
        
        <TouchableOpacity 
          style={{ width: '24%', height: '100%', alignSelf: 'flex-end', borderRadius: 4 }} 
          onPress={showCalendarModal}
        >
          <Image 
            style={{ width: 40, height: 40 }}
            source={require('../assets/images/calendar1.png')} 
          />
        </TouchableOpacity>
          <Modal
        style={{
            width: 200,
            height: 200
        }}
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                current={format(date, 'yyyy-MM-dd')}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                theme={{
                  calendarBackground: '#ffffff',
                  selectedDayBackgroundColor: '#0072C8',
                  todayTextColor: '#0072C8',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9d9d9',
                  arrowColor: '#0072C8',
                  monthTextColor: '#0072C8',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: ts(14),
                  textMonthFontSize: ts(14),
                  textDayHeaderFontSize: ts(14)
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.containerrow}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#111"
        value={formatDate(date)}
        editable={false}
      />
      
      <TouchableOpacity 
        style={{ alignSelf: 'flex-end', borderRadius: 4 }} 
        onPress={showCalendarModal}
      >
        <Image 
          style={{ width: 40, height: 40,  }}
          source={require('../assets/images/calendar1.png')} 
        />
      </TouchableOpacity>
<TouchableOpacity onPress={()=> setShowCalendar(false)}>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={format(date, 'yyyy-MM-dd')}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                calendarBackground: '#ffffff',
                selectedDayBackgroundColor: '#0072C8',
                todayTextColor: 'rgba(0, 114, 200, 1)',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9d9d9',
                arrowColor: '#0072C8',
                monthTextColor: '#0072C8',//3d3d3d
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: ts(14),
                textMonthFontSize: ts(14),
                textDayHeaderFontSize: ts(14)
              }}
            />
          </View>
        </View>
        
      </Modal></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  //  width: '90%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //width: '20%',
  },
  containerrow: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 11,
    paddingBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
   // position: 'absolute',
  },
  containerrowMin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 12,
    backgroundColor: '#fff',
    width: '0%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
   // width: '70%',
    height: 42,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  inputMin: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9d9d938',
    //width: '66%',
    height: 42,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});

export default CalendarOnWrite;