import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Checkpoint } from '@/types';

const RouteDistance = () => {
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [formValues, setFormValues] = useState({});

  const filterCriteria = (item: Checkpoint) => {
    return function(field: Checkpoint) {
      const isSameCheckpoint = item.id !== field.id
      const fieldIsStart = field.type !== "START"
      const startToEnd = !(item.type === "START" && field.type === "FINISH")
      return isSameCheckpoint && fieldIsStart && startToEnd
    }
  }

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
      {checkpoints.filter(checkpoint => checkpoint.type !== "FINISH").map((checkpoint, index) => (
        <View key={index} style={styles.itemContainer}>
          <TouchableOpacity onPress={() => toggleItem(index)} style={styles.itemHeader}>
            <Text style={styles.itemText}>{checkpoint.name + ((checkpoint.type === "START") ? " (Lähtö)" : "")}</Text>
          </TouchableOpacity>
          {expandedIndex === index && (
            <View style={styles.formContainer}>
              {checkpoints.filter(filterCriteria(checkpoint)).map((field, index2) => (
                <TextInput
                  key={index2}
                  style={styles.input}
                  placeholder={field.name + ((field.type === "FINISH") ? " (Maali)" : "")}
                  value={formValues[index]?.[field.name] || ''}
                  onChangeText={(text) => handleInputChange(index, field.name, text)}
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