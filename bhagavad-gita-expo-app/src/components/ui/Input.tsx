import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';
import { Colors } from '../../constants/theme';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  keyboardType = 'default',
  returnKeyType = 'done',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
  onSubmitEditing,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 6,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    borderWidth: 1,
    borderRadius: 8,
    borderColor: error ? Colors.primary[500] : isFocused ? Colors.primary[400] : Colors.gray[300],
    backgroundColor: editable ? '#ffffff' : Colors.gray[50],
    paddingHorizontal: 12,
    paddingVertical: multiline ? 12 : 14,
    minHeight: multiline ? numberOfLines * 20 + 24 : 44,
  });

  const getInputStyle = (): TextStyle => ({
    fontSize: 16,
    color: Colors.gray[900],
    flex: 1,
    textAlignVertical: multiline ? 'top' : 'center',
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 12,
    color: Colors.primary[600],
    marginTop: 4,
  });

  return (
    <View style={[getContainerStyle(), style]}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray[400]}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          style={[getInputStyle(), inputStyle]}
        />
      </View>

      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};
