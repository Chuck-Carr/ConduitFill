import React from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => (
  <TouchableOpacity style={styles.resetButton}>
    <Button title="Reset" onPress={onReset} color="red" />
  </TouchableOpacity>
);

export default ResetButton;
