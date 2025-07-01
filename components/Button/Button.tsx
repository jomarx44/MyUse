import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

const Button: React.FC<{ title: string, style?: StyleProp<ViewStyle>, titleStyle?: StyleProp<TextStyle>, onPress?: () => void }> = ({ title, style, titleStyle, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button;