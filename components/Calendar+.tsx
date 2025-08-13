import { Ionicons } from '@expo/vector-icons';
import { format, parse } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Настройка локализации для календаря
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
  statusreq: boolean;
  post?: string;
  onChange?: (dateString: string) => void;
  diseditable?: boolean;
};

const DateInputWithPicker = ({ theme, post, statusreq, onChange, diseditable }: Props) => {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [check, setCheck] = useState<boolean>(false);
  const [startD, setStartD] = useState<boolean>(true);
  const [chooseD, setChooseD] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (post) {
      const customFormat = 'dd.MM.yyyy';
      if (post === ' ') {
        setDate(null);
        setCheck(false);
        setChooseD(false);
      } else {
        const dateFnsDate = parse(post, customFormat, new Date());
        setDate(dateFnsDate);
        setCheck(true);
        setChooseD(true);
      }
    }
  }, [post]);

  useEffect(() => {
    if (statusreq && startD) {
      setStartD(false);
      if (post === ' ') {
        setDate(null);
        setChooseD(false);
      } else if (post) {
        const dateFnsDate = parse(post, 'dd.MM.yyyy', new Date());
        setDate(dateFnsDate);
        setCheck(true);
        setChooseD(true);
      }
    }
  }, [statusreq, post, startD]);

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    setDate(selectedDate);
    setShowCalendar(false);
    setCheck(true);
    setChooseD(true);
    const dateString = format(selectedDate, 'dd.MM.yyyy');
    onChange?.(dateString);
  };

  const handleClearDate = () => {
    setDate(null);
    setCheck(false);
    setChooseD(false);
    onChange?.(' ');
  };

  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => fontSize / fontScale;

  const markedDates = date ? {
    [format(date, 'yyyy-MM-dd')]: {
      selected: true,
      selectedColor: '#0072C8'
    }
  } : {};

  const renderCalendarModal = () => (
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
                current={date ? format(date, 'yyyy-MM-dd') : undefined}
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
    </TouchableOpacity>
  );

  const renderDatePickerButton = () => (
    <TouchableOpacity 
      onPress={() => setShowCalendar(true)}
      disabled={diseditable}
      style={{ justifyContent: 'center', borderRadius: 4 }}
    >
      <Image 
        style={{ width: 40, height: 40 }}
        source={require('../assets/images/calendar1.png')} 
      />
    </TouchableOpacity>
  );

  if (theme === 'min') {
    return (
      <View style={styles.containerrowMin}>
        <TextInput
          style={[
            styles.inputMin,
            { fontSize: ts(14), textAlignVertical: 'center' }
          ]}
          placeholderTextColor="#111"
          editable={false}
          value={check && date ? format(date, 'dd.MM.yyyy') : ' '}
        />
        
        {chooseD ? (
          <TouchableOpacity 
            onPress={handleClearDate}
            style={{ width: 40 }}
            disabled={diseditable}
          >
            <Ionicons name='close-outline' size={30} style={{ alignSelf: 'center' }}/>
          </TouchableOpacity>
        ) : (
          renderDatePickerButton()
        )}
        {renderCalendarModal()}
      </View>
    );
  }

  return (
    <View style={styles.containerrow}>
      <TextInput
        style={[
          styles.input,
          { fontSize: ts(14) }
        ]}
        placeholderTextColor="#111"
        editable={false}
        value={check && date ? format(date, 'dd.MM.yyyy') : ' '}
      />
      
      {renderDatePickerButton()}
      {renderCalendarModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
   // width: '90%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //width: '20%',
  },
  containerrow: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
   // width: '100%',
    flexDirection: 'row',
    marginBottom: 13,
    alignItems: 'center',
  },
  containerrowMin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '70%',
    height: 42,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  inputMin: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
   width: '70%',
    height: 42,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});

export default DateInputWithPicker;