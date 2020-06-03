/***
/*  Made with Love
/*  Hasan Aydın ©
/*  www.hasanaydins.com
/***/

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';

import {useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Box from '../components/Base/Box';
import Button from '../components/Base/Button';
import Text from '../components/Base/Text';
import CardCountry from '../components/CardCountry';
import SvgSearch from '../components/icons/Search';
import i18n from '../i18n';
import theme from '../utils/theme';
import ChartCases from './ChartCases';
import ChartDeaths from './ChartDeaths';
import CountryDetail from './CountryDetail';

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator headerMode='none'>
      <SearchStack.Screen name='Search' component={Search} />
      <SearchStack.Screen name='CountryDetail' component={CountryDetail} />
      <SearchStack.Screen name='ChartCases' component={ChartCases} />
      <SearchStack.Screen name='ChartDeaths' component={ChartDeaths} />
    </SearchStack.Navigator>
  );
}

function Search({ navigation }) {
  let [countriesData, setCountriesData] = useState([]);
  let [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [isclicked, setIsClicked] = useState(false);

  const getSummaryData = async (sort = 'active') => {
    setLoading(true);

    const response = await fetch(
      `https://corona.lmao.ninja/v2/countries?sort=${sort}`,
    );
    const data = await response.json();

    const responseUpdate = await fetch('https://corona.lmao.ninja/v2/all');
    const dataUpdate = await responseUpdate.json();
    const lastDate = new Date(dataUpdate.updated).toLocaleTimeString();

    setUpdatedDate(lastDate);

    setCountriesData(data);
    setAllData(data);
    setLoading(false);
    setRefreshing(false);
    Snackbar.show({
      text: i18n.get('refreshed'),
      textColor: 'white',
      backgroundColor: theme.colors.success,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  useEffect(() => {
    getSummaryData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(theme.colors.bglight);
    }, []),
  );

  const renderHeader = () => {
    return (
      <TextInput
        style={{ borderBottomWidth: 1, borderColor: '#cccc' }}
        height={50}
        borderRadius={12}
        onChangeText={txt => {
          setText(txt);
          searchFilter(txt);
        }}
        value={text}
        secureTextEntry={false}
        autoCapitalize='words' // characters, sentences ,  none
        placeholder={i18n.get('enterCountry')}
        paddingLeft={18}
        ref={ref => (this.inputText = ref)}
      />
    );
  };

  const searchFilter = txt => {
    const newData = allData.filter(item => {
      const listItem = `${item.country.toLowerCase()}}`;
      return listItem.indexOf(txt.toLowerCase()) > -1;
    });

    setCountriesData(newData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getSummaryData();
    setIsClicked(false);
    Snackbar.show({
      text: i18n.get('refreshing'),
      textColor: 'white',
      backgroundColor: theme.colors.success,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <Box
      as={SafeAreaView}
      flex={1}
      backgroundColor={theme.colors.bglight}
      height='100%'
      paddingTop={26}
      paddingLeft={26}
      paddingRight={14}
    >
      {/* BACKSGROUND */}
      <Box
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        paddingRight={12}
      >
        <Text fontSize={23} fontWeight='bold'>
          {i18n.get('countries')}
        </Text>

        <Button
          onPress={async () => {
            await setIsClicked(true);
            this.inputText.focus();
          }}
        >
          <SvgSearch color={theme.colors.textlight} width={32} />
        </Button>
      </Box>

      <Box
        flexDirection='row'
        alignItems='center'
        mt={12}
        justifyContent='space-between'
      >
        <Box flexDirection='row' alignItems='center'>
          <Box size={8} bg='warning' borderRadius={999} mr={8} />
          <Text mr={10} fontSize={11} color='textdark'>
            {i18n.get('active')}
          </Text>
        </Box>
        <Box flexDirection='row' alignItems='center'>
          <Box size={8} bg='success' borderRadius={999} mr={8} />
          <Text mr={10} fontSize={11} color='textdark'>
            {i18n.get('recovered')}
          </Text>
        </Box>
        <Box flexDirection='row' alignItems='center'>
          <Box size={8} bg='danger' borderRadius={999} mr={8} />
          <Text mr={10} fontSize={11} color='textdark'>
            {i18n.get('death')}
          </Text>
        </Box>

        <Text fontSize={9} color='textlight' paddingRight={12}>
          {i18n.get('lastUpdate')}: {updatedDate}
        </Text>
      </Box>

      {countriesData.length ? (
        <FlatList
          ListHeaderComponent={isclicked ? renderHeader() : null}
          style={{ marginTop: 6, paddingRight: 12 }}
          data={countriesData}
          renderItem={item => (
            <CardCountry
              country={item.item.country}
              deaths={item.item.deaths}
              active={item.item.active}
              recovered={item.item.recovered}
              navigation={navigation}
            />
          )}
          flex={1}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0} // 0 ise sadece en dibe geldiginizde loadMore yapılır
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <Box flex={1} justifyContent='center' alignItems='center'>
          <ActivityIndicator />
          <Text>Đang cập nhật...</Text>
        </Box>
      )}
    </Box>
  );
}

export default SearchStackScreen;
