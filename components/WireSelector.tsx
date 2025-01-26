import React, { useState, useEffect } from 'react';
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
}

const WireSelector: React.FC<WireSelectorProps> = ({ setWireDiameters }) => {
  const [selectedWires, setSelectedWires] = useState<{ [wireId: string]: number }>({});
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  // Render wire items in the modal
  const renderWireItem = (wire: Wire) => {
    const isSelected = selectedWires[wire.id] !== null;
    const quantity = selectedWires[wire.id] || 0;

    return (
      <View style={styles.item} key={wire.id}>
        <TouchableOpacity onPress={() => handleWireSelection(wire.id)}>
          <Text style={[styles.wireText, isSelected ? styles.selectedText : null]}>
            {wire.wire_type}
          </Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.quantityContainer}>
            <Button title={`-1`} onPress={() => handleDecrement(wire.id)} color="#F44336" />
            <Text style={styles.quantityText}>Quantity: {quantity}</Text>
            <Button title={`+1`} onPress={() => handleIncrement(wire.id)} color="#4CAF50" />
          </View>
        )}
      </View>
    );
  };

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
  };
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      {/* Add Wires button to open the modal */}
      {/* <Button title="Add Wires" onPress={() => setModalVisible(true)} /> */}
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
                                selectedWires[wire.id] ? styles.selectedText: null,
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
                  .find((wire) => wire.id === wireId); // wire.id is a string, no need to parse

                // Only return the wire if found, otherwise skip
                return wire ? { ...wire, quantity: selectedWires[wireId] } : undefined;
              })
              .filter((wire): wire is Wire & { quantity: number } => wire !== undefined)} // Type guard to filter out undefined
            renderItem={({ item }) => renderSelectedWireItem(item)}
            keyExtractor={(item) => item.id} // wire.id is already a string, no need to convert
          />
        </View>
      )}


      {/* <Button  title="Submit" onPress={() => console.log(selectedWires)} /> */}
      <Button 
  title="Submit" 
  onPress={() => {
    // Map over the selected wires and repeat the outer diameter based on the quantity
    const selectedWireDiameters = Object.keys(selectedWires)
      .flatMap((wireId) => {
        const wire = manufacturers
          .flatMap((manufacturer) => manufacturer.wires)
          .find((wire) => wire.id === wireId); // Find the wire by ID

        const quantity = selectedWires[wireId];
        // Convert the outer_diameter_in (string) to a number before returning it
        return wire ? Array(quantity).fill(parseFloat(wire.outer_diameter_in)) : []; // Convert to number
      })
      .filter((diameter): diameter is number => !isNaN(diameter)); // Filter out invalid numbers
  
    // Pass the wire diameters (as numbers) to the parent via setWireDiameters
    setWireDiameters(selectedWireDiameters);
    console.log(selectedWireDiameters); // Logging to check the output
  }} 
/>




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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // Light gray border for soft separation
    paddingBottom: 15,
  },
  wireText: {
    fontSize: 18,
    color: '#333333', // Dark charcoal gray for primary text
    fontWeight: '600',
    paddingVertical: 12,
    flex: 1,
  },
  selectedText: {
    backgroundColor: '#00B8A9',  // Muted teal for selected wire items
    color: '#FFFFFF',  // White text for contrast
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontWeight: '700',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
    color: '#333333', // Dark charcoal gray for quantity text
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for modal background
  },
  modalContent: {
    width: '90%',
    padding: 25,
    backgroundColor: '#FFFFFF', // White background for modal content
    borderRadius: 15,
    elevation: 6,  // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333', // Dark charcoal gray for modal title
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
  manufacturerContainer: {
    marginBottom: 25,
  },
  manufacturerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF8B8B', // Pastel pink for manufacturer names to create visual interest
  },
  selectedWiresContainer: {
    marginTop: 30,
  },
  selectedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333', // Dark charcoal gray for selected wire title
  },
  selectedWireItem: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white', // Light pastel orange for selected wire items
  },
  selectedWireContent: {
    flex: 1,
  },
  selectedWireText: {
    fontSize: 16,
    color: '#333333', // Dark charcoal gray for wire details text
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    width: 120,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#00B8A9',  // Muted teal for action buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for buttons
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#FFB86C',  // Light pastel orange for cancel button
  },
  resetButton: {
    backgroundColor: '#FFB86C',  // Light pastel orange for reset button
  },
  submitButton: {
    backgroundColor: '#00B8A9',  // Muted teal for submit button
    fontSize: 40,
  },
  modalButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#FF8B8B',  // Pastel pink for modal confirm button
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text for modal buttons
  },
});





export default WireSelector;
