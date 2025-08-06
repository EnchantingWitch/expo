import CustomButton from '@/components/CustomButton';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from 'react-native';

type Reqs = {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  description: string;
  organisation: string;
  role: string;
  creationTime: string; 
  objectToAdd: [{
    capitalCSName: string,
    codeCCS: string,
  }],
  organisationName?: string; // Добавил, так как вы используете это поле
};

const DirectionLayout = () => {
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<Reqs[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => (fontSize / fontScale);

  const navigation = useNavigation();
    
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace('/admin/menu')}>
          <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Reqs[]>([]);

  const getReqs = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/getAll',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      setData(json);
      setFilteredData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...data];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.organisationName?.toLowerCase().includes(query)
      );
    }
    setFilteredData(result);
  }, [searchQuery, data]);

  useEffect(() => {
    getReqs();
  }, []);
//<View style={{flex: 1, alignSelf: 'center', width: isDesktopWeb && screenWidth>900? 900 : '100%'}}>
  return (
      <View style={styles.container}>
    <View style={{
      flex: 1,
   //   width: '100%',
      width: isDesktopWeb && screenWidth>900? 900 : '100%',
      alignSelf: 'center'
    }}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Поиск по организации"
          placeholderTextColor={'#B2B3B3'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <TouchableWithoutFeedback 
                onPress={() => { 
                  router.push({
                    pathname: '/admin/organization', 
                    params: {id: item.id, organisation: item.organisationName }
                  });
                }}
              >
                <View style={styles.itemContainer}>
                  <Text style={[styles.itemText, { fontSize: ts(14) }]}>
                    {item.organisationName}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>Нет данных для отображения</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
    
    <View style={[styles.buttonContainer, { paddingBottom: BOTTOM_SAFE_AREA + 16 }]}>
      <CustomButton
        title="Добавить организацию"
        handlePress={() => router.push('./create_organization')}
      />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    //paddingVertical: 16,
    paddingBottom: 8,
    width: '96%',
    alignSelf: 'center'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    //paddingHorizontal: 16,
    alignSelf: 'center',
     width: '96%',
  },
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 16,
    flex: 1,
     flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: '#E0F2FE',
    flexDirection: 'row',
    width: '100%',
    height: 42,
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  itemText: {
    color: '#334155',
    textAlign: 'left',
    alignSelf: 'center',
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  buttonContainer: {
    paddingHorizontal: 16,
   // paddingTop: 16,
  },
});

export default DirectionLayout;