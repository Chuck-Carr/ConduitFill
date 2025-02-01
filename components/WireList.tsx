import React from 'react';
import { FlatList, Text, View, Button } from 'react-native';
import { styles } from '../styles/styles';

interface Wire {
  id: string;
  wire_type: string;
  outer_diameter_in: string;
}

interface WireListProps {
  selectedWires: { [key: string]: number };
  onIncrement: (wireId: string) => void;
  onDecrement: (wireId: string) => void;
  wiresData: { manufacturer_id: number; name: string; wires: Wire[] }[];
}

const WireList: React.FC<WireListProps> = ({ selectedWires, onIncrement, onDecrement, wiresData }) => (
  <View style={styles.selectedWiresContainer}>
    <Text style={styles.selectedTitle}>Selected Wires</Text>
    <FlatList
      data={Object.keys(selectedWires)
        .map((wireId) => {
          const wire = wiresData.flatMap((manufacturer) => manufacturer.wires).find((wire) => wire.id === wireId);
          return wire ? { ...wire, quantity: selectedWires[wireId] } : undefined;
        })
        .filter((wire) => wire !== undefined)}
      renderItem={({ item }) => (
        <View style={styles.selectedWireItem} key={item.id}>
          <View style={styles.selectedWireContent}>
            <Text style={styles.selectedWireText}>{item.wire_type}</Text>
            <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
          </View>
          <View style={styles.quantityButtons}>
            <Button title={`-1`} onPress={() => onDecrement(item.id)} color="#F44336" />
            <Button title={`+1`} onPress={() => onIncrement(item.id)} color="#4CAF50" />
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  </View>
);

export default WireList;
