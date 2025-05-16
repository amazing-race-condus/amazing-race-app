import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#2d3f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    margin: 10,
    fontSize: 30,
    fontWeight: '600',
    color: '#fcba03',
  },
  link: {
    margin: 1,
    padding: 6,
    borderWidth: 1,
    backgroundColor: '#abbbd4',
    width: '90%',
  },
  content: {
    flex: 1,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  inputField: {
    borderWidth: 1,
    width: 355,
    paddingVertical: 7,
    textAlignVertical: 'auto',
    marginBottom:10
  },
  button: {
    height: 30,
    width: 355,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
