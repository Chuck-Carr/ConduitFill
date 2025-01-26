import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import WireSelector from '../components/WireSelector';

const ConduitSpaceCalculator = () => {
  const [wireDiameters, setWireDiameters] = useState<number[]>([]); // wireDiameters is an array of numbers
  const [conduitSize, setConduitSize] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    // Define conduit diameters
    const conduitDiameters: Record<string, number> = {
      '1/2': 0.622,  // 1/2" Conduit
      '1': 1.049,    // 1" Conduit
      '3/4': 0.824   // 3/4" Conduit
    };

    // Calculate area of conduit
    const conduitArea = Math.PI * Math.pow(conduitDiameters[conduitSize] / 2, 2);

    // Calculate total wire area
    let totalWireArea = 0;
    wireDiameters.forEach(diameter => {
      totalWireArea += Math.PI * Math.pow(diameter / 2, 2);
    });

    // Calculate percentage usage
    const percentageUsed = (totalWireArea / conduitArea) * 100;

    // Convert to number before setting result
    setResult(parseFloat(percentageUsed.toFixed(2)));
  };

  return (
    <View style={styles.container}>
      {/* WireSelector handles the wire diameters */}
      <WireSelector setWireDiameters={setWireDiameters} />

      <Text>Select Conduit Size:</Text>
      <Picker
        selectedValue={conduitSize}
        onValueChange={(itemValue: string) => setConduitSize(itemValue)}
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
    padding: 20,
    backgroundColor: "#2C3E50",
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConduitSpaceCalculator;
