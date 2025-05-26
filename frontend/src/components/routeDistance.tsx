import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RouteDistance = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [formValues, setFormValues] = useState({});
  const checkpoints = {
    0: {type: "start", name: "Oodi"},
    1: {type: "intermediate", name: "Kalasatama"},
    2: {type: "intermediate", name: "Testi"},
    3: {type: "end", name: "Kisahalli"}
  }
  const items = [0, 1, 2, 3];

  const filterCriteria = (item: number) => {
    return function(field: number) {
      const isSameCheckpoint = item !== field
      const fieldIsStart = checkpoints[field].type !== "start"
      const startToEnd = !(checkpoints[item].type === "start" && checkpoints[field].type === "end")
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
      {items.filter(item => checkpoints[item].type !== "end").map((item) => (
        <View key={item} style={styles.itemContainer}>
          <TouchableOpacity onPress={() => toggleItem(item)} style={styles.itemHeader}>
            <Text style={styles.itemText}>{checkpoints[item].name}</Text>
          </TouchableOpacity>
          {expandedIndex === item && (
            <View style={styles.formContainer}>
              {items.filter(filterCriteria(item)).map((field) => (
                <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={String(checkpoints[field].name)}
                  value={formValues[item]?.[field] || ''}
                  onChangeText={(text) => handleInputChange(item, field, text)}
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