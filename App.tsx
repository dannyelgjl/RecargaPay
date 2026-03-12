import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/routes';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/styles/theme/theme';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { StatusBar } from 'react-native';
import { I18nProvider } from './src/i18n';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={theme.colors.background}
            />
            <RootNavigator />
          </NavigationContainer>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
