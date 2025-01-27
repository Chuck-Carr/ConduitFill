import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, StatusBar } from 'react-native';
import wiresData from '../assets/wiresData.json'; // Adjust path as needed

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

const ConduitSpaceCalculator = () => {
  const [selectedWires, setSelectedWires] = useState<{ [wireId: string]: number }>({});
  const [conduitSize, setConduitSize] = useState<'1/2' | '1' | '3/4'>('1'); // Conduit size, limited to '1/2', '1', or '3/4'
  const [result, setResult] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const conduitDiameters: Record<'1/2' | '1' | '3/4', number> = {
    '1/2': 0.622,  // 1/2" Conduit
    '1': 1.049,    // 1" Conduit
    '3/4': 0.824   // 3/4" Conduit
  };

  // Calculate the percentage used in the conduit
  const handleCalculate = useCallback(() => {
    const conduitDiameter = conduitDiameters[conduitSize];
    if (!conduitDiameter) return;

    // Calculate area of the conduit
    const conduitArea = Math.PI * Math.pow(conduitDiameter / 2, 2);

    // Calculate total wire area
    let totalWireArea = 0;
    Object.keys(selectedWires).forEach((wireId) => {
      const wire = wiresData
        .flatMap((manufacturer) => manufacturer.wires)
        .find((wire) => wire.id === wireId);
      if (wire) {
        const wireDiameter = parseFloat(wire.outer_diameter_in);
        totalWireArea += Math.PI * Math.pow(wireDiameter / 2, 2) * selectedWires[wireId]; // Multiply by quantity
      }
    });

    // Calculate percentage usage
    const percentageUsed = (totalWireArea / conduitArea) * 100;
    setResult(parseFloat(percentageUsed.toFixed(2)));
  }, [conduitSize, selectedWires]);

  useEffect(() => {
    handleCalculate(); // Recalculate when conduit size or selected wires change
  }, [selectedWires, conduitSize, handleCalculate]);

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

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedWires({});
    setResult(null); // Reset percentage
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>

      {/* Modal for selecting wires */}
      <TouchableOpacity style={styles.addWireButton} onPress={openModal}>
        <Text style={styles.addCableText}>Add Cable</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Wires</Text>
            <ScrollView style={styles.scrollView}>
              {wiresData && wiresData.length > 0
                ? wiresData.map((manufacturer) => (
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
            <TouchableOpacity style={styles.confirmButton}>
              <Button title="Confirm" onPress={closeModal} />
            </TouchableOpacity>
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
                const wire = wiresData
                  .flatMap((manufacturer) => manufacturer.wires)
                  .find((wire) => wire.id === wireId);
                // Only return the wire if found, otherwise skip
                return wire ? { ...wire, quantity: selectedWires[wireId] } : undefined;
              })
              .filter((wire): wire is Wire & { quantity: number } => wire !== undefined)}
            renderItem={({ item }) => (
              <View style={styles.selectedWireItem} key={item.id}>
                <View style={styles.selectedWireContent}>
                  <Text style={styles.selectedWireText}>
                    {item.wire_type} - {item.outer_diameter_in} in
                  </Text>
                  <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
                </View>
                <View style={styles.quantityButtons}>
                  <Button title={`-1`} onPress={() => handleDecrement(item.id)} color="#F44336" />
                  <Button title={`+1`} onPress={() => handleIncrement(item.id)} color="#4CAF50" />
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* Show percentage used */}
      {result !== null && (
        <Text style={styles.percentageText}>
          Conduit Space Used: {result}%
        </Text>
      )}
      
      <View style={styles.conduitSizeButtons}>
        {['1/2', '3/4', '1'].map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.conduitButton,
              conduitSize === size && styles.selectedConduitButton
            ]}
            onPress={() => setConduitSize(size as '1/2' | '1' | '3/4')}
          >
            <Text style={styles.conduitButtonText}>{size}" EMT</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton}>
        <Button title="Reset" onPress={clearAllSelections} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2C3E50",
  },
  conduitSizeButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  conduitButton: {
    padding: 10,
    backgroundColor: '#7F8C8D',
    borderRadius: 5,
    marginTop: 5,
  },
  selectedConduitButton: {
    backgroundColor: '#16A085',
  },
  conduitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addWireButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    width: 100,
    height: 40,
    borderRadius: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: -5,
    marginTop: 10,
  },
    addCableText: {
      color: "#fff"

  },
    confirmButton: {
      backgroundColor: "#d3d3d3",
      width: 100,
      alignSelf: "center",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: -10,
  },
  selectedWireItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 20,
    marginBottom: 5,
  },
  selectedWireContent: {
    flexDirection: 'column',
  },
  selectedWireText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    marginLeft: 10,
  },
  quantityButtons: {
    flexDirection: 'row',
    flex: .45,
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
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
    paddingLeft: 5,
  },
  selectedText: {
    fontWeight: 'bold',
    color: "#fff",
    backgroundColor: "#007BFF",
    borderRadius: 5,
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
    height: "70%",
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "white",
    width: 150,
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
  }
});

export default ConduitSpaceCalculator;
