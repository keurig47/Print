import { atom } from 'recoil';

const currentUserState = atom({
  key: 'currentUserState',
  default: "", 
});

const printerSelectedState = atom({
  key: 'printerSelectedState',
  default: [],
});

const materialSelectedState = atom({
  key: 'materialSelectedState',
  default: "Any",
});

const colorSelectedState = atom({
  key: 'colorSelectedState',
  default: "Any",
});

export {
  currentUserState,
  printerSelectedState,
  materialSelectedState,
  colorSelectedState,
}
