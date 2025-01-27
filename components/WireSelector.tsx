import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import wiresData from '../assets/wiresData.json';  // Adjust path as needed

interface Wire {
  id: string;  // Wire id is a string
  wire_type: string;
  outer_diameter_in: string;
}

interface Manufacturer {
  manufacturer_id: number;
  name: string;
  wires: Wire[];
}

interface WireSelectorProps {
  setWireDiameters: (diameters: number[]) => void;  // Type the prop as a function that takes an array of numbers
  conduitSize: string;  // Add conduitSize to props
}

const WireSelector: React.FC<WireSelectorProps> = ({ setWireDiameters, conduitSize }) => {
  const [selectedWires, setSelectedWires] = useState<{ [wireId: string]: number }>({});
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [percentageUsed, setPercentageUsed] = useState<number | null>(null);

  const conduitDiameters = {
    '1/2': 0.622,  // 1/2" Conduit
    '1': 1.049,    // 1" Conduit
    '3/4': 0.824   // 3/4" Conduit
  };

  // Load and flatten wires data
  useEffect(() => {
    if (wiresData && Array.isArray(wiresData)) {
      setManufacturers(wiresData);
    } else {
      console.error('Wires data is not in the expected format');
    }
  }, []);

  // Handle wire selection
  const handleWireSelection = (wireId: string) => {
    const newSelection = { ...selectedWires };

    if (newSelection[wireId] !== undefined) {
      delete newSelection[wireId]; // Unselect wire if already selected
    } else {
      newSelection[wireId] = 1; // Default quantity when selected
    }

    setSelectedWires(newSelection);
  };

  // Increment the quantity of a selected wire
  const handleIncrement = (wireId: string) => {
    const newSelection = { ...selectedWires };
    newSelection[wireId] = (newSelection[wireId] || 0) + 1;
    setSelectedWires(newSelection);
  };

  // Decrement the quantity of a selected wire
  const handleDecrement = (wireId: string) => {
    const newSelection = { ...selectedWires };
    if (newSelection[wireId] > 1) {
      newSelection[wireId] -= 1;
    } else {
      delete newSelection[wireId]; // Remove wire if quantity is 1 or less
    }
    setSelectedWires(newSelection);
  };

  // Perform the calculation for the conduit space usage
  const calculateConduitUsage = useCallback(() => {
    const conduitDiameter = conduitDiameters[conduitSize as keyof typeof conduitDiameters];
    if (!conduitDiameter) return;

    // Calculate area of conduit
    const conduitArea = Math.PI * Math.pow(conduitDiameter / 2, 2);

    // Calculate total wire area
    let totalWireArea = 0;
    Object.keys(selectedWires).forEach((wireId) => {
      const wire = manufacturers
        .flatMap((manufacturer) => manufacturer.wires)
        .find((wire) => wire.id === wireId);
      if (wire) {
        const wireDiameter = parseFloat(wire.outer_diameter_in);
        totalWireArea += Math.PI * Math.pow(wireDiameter / 2, 2) * selectedWires[wireId]; // Multiply by quantity
      }
    });

    // Calculate percentage usage
    const percentageUsed = (totalWireArea / conduitArea) * 100;

    setPercentageUsed(parseFloat(percentageUsed.toFixed(2)));
  }, [conduitSize, selectedWires, manufacturers]);

  // Trigger calculation when wires are selected or conduit size changes
  useEffect(() => {
    calculateConduitUsage();
  }, [calculateConduitUsage]);

  // Render selected wire items with quantity control
  const renderSelectedWireItem = (wire: Wire & { quantity: number }) => {
    const quantity = wire.quantity;

    return (
      <View style={styles.selectedWireItem} key={wire.id}>
        <View style={styles.selectedWireContent}>
          <Text style={styles.selectedWireText}>
            {wire.wire_type} - {wire.outer_diameter_in} in
          </Text>
          <Text style={styles.quantityText}>Quantity: {quantity}</Text>
        </View>
        <View style={styles.quantityButtons}>
          <Button title={`-1`} onPress={() => handleDecrement(wire.id)} color="#F44336" />
          <Button title={`+1`} onPress={() => handleIncrement(wire.id)} color="#4CAF50" />
        </View>
      </View>
    );
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedWires({});
    setPercentageUsed(null); // Reset percentage
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      {/* Add Wires button to open the modal */}
      <TouchableOpacity style={styles.addWireButton} onPress={openModal}>
        <Text>Add Cable</Text>
      </TouchableOpacity>

      {/* Modal for selecting wires */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close the modal on request
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Wires</Text>
            <ScrollView style={styles.scrollView}>
              {manufacturers && manufacturers.length > 0
                ? manufacturers.map((manufacturer) => (
                    <View key={manufacturer.manufacturer_id} style={styles.manufacturerContainer}>
                      <Text style={styles.manufacturerName}>{manufacturer.name}</Text>
                      {manufacturer.wires.map((wire) => (
                        <View key={wire.id}>
                          <TouchableOpacity onPress={() => handleWireSelection(wire.id)}>
                            <Text
                              style={[
                                styles.wireText,
                                selectedWires[wire.id] ? styles.selectedText : null,
                              ]}
                            >
                              {wire.wire_type} - {wire.outer_diameter_in} in
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ))
                : <Text>No wires available.</Text>}
            </ScrollView>
            <Button title="Confirm" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Display selected wires */}
      {Object.keys(selectedWires).length > 0 && (
        <View style={styles.selectedWiresContainer}>
          <Text style={styles.selectedTitle}>Selected Wires</Text>
          <FlatList
            data={Object.keys(selectedWires)
              .map((wireId) => {
                const wire = manufacturers
                  .flatMap((manufacturer) => manufacturer.wires)
                  .find((wire) => wire.id === wireId);
                // Only return the wire if found, otherwise skip
                return wire ? { ...wire, quantity: selectedWires[wireId] } : undefined;
              })
              .filter((wire): wire is Wire & { quantity: number } => wire !== undefined)}
            renderItem={({ item }) => renderSelectedWireItem(item)}
            keyExtractor={(item) => item.id} // wire.id is already a string, no need to convert
          />
        </View>
      )}

      {/* Show percentage used */}
      {percentageUsed !== null && (
        <Text style={styles.percentageText}>
          Conduit Space Used: {percentageUsed}%
        </Text>
      )}

      <Button title="Reset" onPress={clearAllSelections} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F4F6F9',  // Light grayish-blue for a soft, neutral background
    borderRadius: 40
  },
  addWireButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    width: 100,
    height: 40,
    borderRadius: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  selectedWireItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedWireContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  selectedWireText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {  // Add this missing style
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manufacturerContainer: {
    marginBottom: 15,
  },
  manufacturerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  wireText: {
    fontSize: 16,
    color: '#007BFF',
    paddingVertical: 5,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#28A745',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  scrollView: {
    maxHeight: 300,
  },
  selectedWiresContainer: {
    marginTop: 20,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
});


export default WireSelector;
