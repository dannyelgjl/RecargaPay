import { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  Platform,
} from 'react-native';

const { StatusBarManager } = NativeModules;

export const useStatusBarHeight = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    const getStatusBarHeight = () => {
      if (StatusBarManager && StatusBarManager.getHeight) {
        StatusBarManager.getHeight(({ height }: { height: number }) => {
          setStatusBarHeight(height);
        });
      } else if (Platform.OS === 'android') {
        setStatusBarHeight(StatusBar.currentHeight || 20);
      } else {
        setStatusBarHeight(20);
      }
    };

    getStatusBarHeight();

    const emitter = new NativeEventEmitter(StatusBarManager);
    const eventListener = emitter.addListener(
      'statusBarFrameDidChange',
      ({ frame }) => {
        setStatusBarHeight(frame.height);
      },
    );

    return () => {
      eventListener.remove();
    };
  }, []);

  return statusBarHeight;
};
