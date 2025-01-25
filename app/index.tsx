import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const ConduitSpaceCalculator = () => {
  const [wireDiameters, setWireDiameters] = useState('');
  const [conduitSize, setConduitSize] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const wireDiametersArray = wireDiameters.split(',').map(d => parseFloat(d.trim()));

    // Define conduit diameters based on selection
    const conduitDiameters: Record<string, number> = {
      
      '1/2': 0.622,  // 1/2" Conduit
      '1': 1.049,    // 1" Conduit
      '3/4': 0.824   // 3/4" Conduit
    };

    // Calculate area of conduit
    const conduitArea = Math.PI * Math.pow(conduitDiameters[conduitSize] / 2, 2);

    // Calculate total wire area
    let totalWireArea = 0;
    wireDiametersArray.forEach(diameter => {
      totalWireArea += Math.PI * Math.pow(diameter / 2, 2);
    });

    // Calculate percentage usage
    const percentageUsed = (totalWireArea / conduitArea) * 100;

    // Convert to number before setting result
    setResult(parseFloat(percentageUsed.toFixed(2)));
  };

  return (
    <View style={styles.container}>
      <Text>Enter Wire Diameters (comma-separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 0.2, 0.3, 0.5"
        value={wireDiameters}
        onChangeText={setWireDiameters}
      />
      <Text>Select Conduit Size:</Text>
      <Picker
        selectedValue={conduitSize}
        onValueChange={(itemValue: string) => setConduitSize(itemValue)}  // Explicitly typing this as string
      >
        <Picker.Item label="1 Inch" value="1" />
        <Picker.Item label="3/4 Inch" value="3/4" />
        <Picker.Item label="1/2 Inch" value="1/2" />
      </Picker>

      <Button title="Calculate" onPress={handleCalculate} />

      {result !== null && (
        <Text style={styles.resultText}>Percentage of Space Used: {result}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConduitSpaceCalculator;