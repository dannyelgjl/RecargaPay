import 'styled-components/native';
import { TTheme } from '../styles/theme/theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends TTheme {}
}
