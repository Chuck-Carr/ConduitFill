import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles/styles';

interface ResultDisplayProps {
  result: number | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (result === null) return null;

  return (
    <Text style={styles.percentageText}>
      Conduit Space Used: {result}%
    </Text>
  );
};

export default ResultDisplay;
