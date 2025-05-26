import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RouteDistance = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [formValues, setFormValues] = useState({});

  const items = ['Oodi', 'Kalasatama', 'Kisahalli'];
  const formFields = ['Oodi', 'Kalasatama', 'Kisahalli']; // Fields per item

  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleInputChange = (itemIndex, field, text) => {
    setFormValues((prev) => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [field]: text,
      },
    }));
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TouchableOpacity onPress={() => toggleItem(index)} style={styles.itemHeader}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
          {expandedIndex === index && (
            <View style={styles.formContainer}>
              {formFields.map((field) => (
                <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={field}
                  value={formValues[index]?.[field] || ''}
                  onChangeText={(text) => handleInputChange(index, field, text)}
                />
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemHeader: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
  formContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default RouteDistance