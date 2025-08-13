import { StyleSheet } from 'react-native';

export const getGlobalStyles = (fontScale: number) => {

const ts = (fontSize: number) => (fontSize / fontScale);

return StyleSheet.create({
    
  text: {//в objs/objects 
   // fontFamily: 'ArialNarrow',
    fontSize: ts(14), 
    color: '#334155', 
    textAlign: 'left'
  },
  view:
  {
    backgroundColor: '#E0F2FE',
    flexDirection: 'row', 
    width: '100%', 
    height: 42,  
    justifyContent: 'center', 
    marginBottom: 15,
    borderRadius: 8
  },
  search:
  {
   // fontFamily: 'ArialNarrow',
    height: 42,
    minHeight: 42, // Фиксируем минимальную высоту
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12, // Горизонтальные отступы
    paddingVertical: 0, // Убираем вертикальные отступы
    backgroundColor: 'white', // Явно задаём фон
    includeFontPadding: false, // Убираем лишние отступы для текста (Android)
    textAlignVertical: 'center', // Центрируем текст вертикально 
  },
  headerTitleStyle:
  {
    //fontFamily: 'ArialNarrow',
    fontSize: ts(20),
  }
});
}


/* в проекте его использовать так:
import { getGlobalStyles } from '../../constants/globalStyles';
const globalStyles = getGlobalStyles(fontScale);

<Text style={globalStyles.text}>Привет, мир!</Text>
*/