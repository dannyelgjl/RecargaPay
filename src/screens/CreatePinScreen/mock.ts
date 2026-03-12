export const PIN_LENGTH = 4;

export const KEYS = [
  [
    { type: 'digit', value: '1', letters: '' },
    { type: 'digit', value: '2', letters: 'ABC' },
    { type: 'digit', value: '3', letters: 'DEF' },
  ],
  [
    { type: 'digit', value: '4', letters: 'GHI' },
    { type: 'digit', value: '5', letters: 'JKL' },
    { type: 'digit', value: '6', letters: 'MNO' },
  ],
  [
    { type: 'digit', value: '7', letters: 'PQRS' },
    { type: 'digit', value: '8', letters: 'TUV' },
    { type: 'digit', value: '9', letters: 'WXYZ' },
  ],
  [
    { type: 'action', value: 'empty' },
    { type: 'digit', value: '0', letters: '' },
    { type: 'action', value: 'delete' },
  ],
] as const;
