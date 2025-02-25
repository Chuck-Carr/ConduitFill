import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/styles';

interface ConduitSizeSelectorProps {
  conduitSize: '3' | '2 1/2' | '2' | '1 1/2' | '1 1/4' | '3/4' | '1/2' | '1';
  setConduitSize: (size: '3' | '2 1/2' | '2' | '1 1/2' | '1 1/4' | '3/4' | '1/2' | '1') => void;
}

const ConduitSizeSelector: React.FC<ConduitSizeSelectorProps> = ({ conduitSize, setConduitSize }) => (
  <View style={styles.conduitSizeButtons}>
    {['3','2 1/2', '2', '1 1/2', '1 1/4', '3/4', '1/2', '1'].map((size) => (
      <TouchableOpacity
        key={size}
        style={[styles.conduitButton, conduitSize === size && styles.selectedConduitButton]}
        onPress={() => setConduitSize(size as '3' | '2 1/2' | '2' | '1 1/2' | '1 1/4'  | '3/4' | '1/2' | '1')}
      >
        <Text style={styles.conduitButtonText}>{size}" EMT</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default ConduitSizeSelector;
