import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import wiresData from '../assets/wiresData.json';
import WireSelectionModal from '../components/WireSelectionModal';
import WireList from '../components/WireList';
import ConduitSizeSelector from '../components/ConduitSizeSelector';
import ResultDisplay from '../components/ResultDisplay';
import ResetButton from '../components/ResetButton';
import { styles } from '../styles/styles';

interface Wire {
  id: string;
  wire_type: string;
  outer_diameter_in: string;
}

interface Manufacturer {
  manufacturer_id: number;
  name: string;
  wires: Wire[];
}

const ConduitSpaceCalculator: React.FC = () => {
  const [selectedWires, setSelectedWires] = useState<{ [key: string]: number }>({});
  const [conduitSize, setConduitSize] = useState<'3' | '2 1/2' | '2' | '1 1/2' | '1 1/4' | '1' | '3/4'>('1');
  const [result, setResult] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const conduitDiameters: Record<'3' | '2 1/2' | '2' | '1 1/2' | '1 1/4' | '1' | '3/4', number> = {
    '3': 3.068,
    '2 1/2': 2.469,
    '2': 2.067,
    '1 1/2': 1.610,
    '1 1/4': 1.380,
    '1': 1.049,
    '3/4': 0.824,
  };

  const handleCalculate = useCallback(() => {
    const conduitDiameter = conduitDiameters[conduitSize];
    if (!conduitDiameter) return;

    const conduitArea = Math.PI * Math.pow(conduitDiameter / 2, 2);
    let totalWireArea = 0;

    Object.keys(selectedWires).forEach((wireId) => {
      const wire = wiresData.flatMap((manufacturer) => manufacturer.wires).find((wire) => wire.id === wireId);
      if (wire) {
        const wireDiameter = parseFloat(wire.outer_diameter_in);
        totalWireArea += Math.PI * Math.pow(wireDiameter / 2, 2) * selectedWires[wireId];
      }
    });

    const percentageUsed = (totalWireArea / conduitArea) * 100;
    setResult(parseFloat(percentageUsed.toFixed(2)));
  }, [conduitSize, selectedWires]);

  useEffect(() => {
    handleCalculate();
  }, [selectedWires, conduitSize, handleCalculate]);

  const handleWireSelection = (wireId: string) => {
    const newSelection = { ...selectedWires };

    if (newSelection[wireId] !== undefined) {
      delete newSelection[wireId];
    } else {
      newSelection[wireId] = 1;
    }

    setSelectedWires(newSelection);
  };

  const handleIncrement = (wireId: string) => {
    setSelectedWires((prev) => ({
      ...prev,
      [wireId]: (prev[wireId] || 0) + 1,
    }));
  };

  const handleDecrement = (wireId: string) => {
    setSelectedWires((prev) => {
      const newSelection = { ...prev };
      
      // Decrement the quantity, and if it reaches 0, delete the wire
      if (newSelection[wireId] > 1) {
        newSelection[wireId] -= 1;
      } else {
        delete newSelection[wireId]; // Remove wire when quantity is 0
      }
      
      return newSelection;
    });
  };

  const handleReset = () => {
    setSelectedWires({});
    setConduitSize('1');
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <Button title="Select Wires" onPress={() => setModalVisible(true)} />
      <WireSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedWires={selectedWires}
        onWireSelection={handleWireSelection}
      />
      <WireList
        selectedWires={selectedWires}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        wiresData={wiresData as Manufacturer[]}
      />
      <ConduitSizeSelector conduitSize={conduitSize} setConduitSize={setConduitSize} />
      <ResultDisplay result={result} />
      <ResetButton onReset={handleReset} />
    </View>
  );
};

export default ConduitSpaceCalculator;
