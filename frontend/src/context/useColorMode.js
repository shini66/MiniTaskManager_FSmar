import { useContext } from 'react';
import { ColorModeContext } from './colorModeContextObject';

export function useColorMode() {
  return useContext(ColorModeContext);
}
