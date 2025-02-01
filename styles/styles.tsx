import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2C3E50",
    justifyContent: "center",
  },
  conduitSizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-evenly',
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
    color: "#fff",
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
    flex: 0.45,
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
    marginBottom: 60,

  },
  resetButton: {
    backgroundColor: "white",
    width: 150,
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
    top: 725,
    left: 120,
    position: 'absolute',
  },
});
