import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import wiresData from '../assets/wiresData.json';
import { styles } from '../styles/styles';

interface WireSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedWires: { [key: string]: number };
  onWireSelection: (wireId: string) => void;
}

const WireSelectionModal: React.FC<WireSelectionModalProps> = ({ visible, onClose, selectedWires, onWireSelection }) => (
  <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Wires</Text>
        <ScrollView style={styles.scrollView}>
          {wiresData && wiresData.length > 0 ? (
            wiresData.map((manufacturer) => (
              <View key={manufacturer.manufacturer_id} style={styles.manufacturerContainer}>
                <Text style={styles.manufacturerName}>{manufacturer.name}</Text>
                {manufacturer.wires.map((wire) => (
                  <TouchableOpacity key={wire.id} onPress={() => onWireSelection(wire.id)}>
                    <Text style={[styles.wireText, selectedWires[wire.id] ? styles.selectedText : null]}>
                      {wire.wire_type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <Text>No wires available.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.confirmButton}>
          <Button title="Confirm" onPress={onClose} />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default WireSelectionModal;
