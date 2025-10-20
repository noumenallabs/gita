import React from 'react';
import { Text, TextStyle } from 'react-native';
import { highlightSearchTerms } from '../utils/search';
import { Colors } from '../constants/theme';

interface HighlightedTextProps {
  text: string;
  searchQuery: string;
  style?: TextStyle;
  highlightStyle?: TextStyle;
  numberOfLines?: number;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchQuery,
  style,
  highlightStyle,
  numberOfLines,
}) => {
  const parts = highlightSearchTerms(text, searchQuery);

  const defaultHighlightStyle: TextStyle = {
    backgroundColor: Colors.amber[200],
    color: Colors.amber[800],
    fontWeight: '600',
  };

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={part.highlighted ? { ...defaultHighlightStyle, ...highlightStyle } : undefined}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
};
