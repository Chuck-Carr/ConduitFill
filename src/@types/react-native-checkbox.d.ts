// src/@types/react-native-checkbox.d.ts
declare module 'react-native-checkbox' {
    import { Component } from 'react';
    import { ViewStyle, TextStyle, StyleProp } from 'react-native';
  
    interface CheckBoxProps {
      checked: boolean;
      onChange: (checked: boolean) => void;
      style?: StyleProp<ViewStyle>;
      labelStyle?: StyleProp<TextStyle>;
      label?: string;
    }
  
    export default class CheckBox extends Component<CheckBoxProps> {}
  }
  