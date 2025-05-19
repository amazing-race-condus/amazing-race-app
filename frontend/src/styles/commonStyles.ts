import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3f5c',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    margin: 10,
    fontSize: 24,
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  links: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    width: 400,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    fontSize: 20,
  },
  title: {
    fontSize: 35,
    margin: 10,
    fontWeight: '600',
    color: '#fcba03',
    textAlign: 'center'
  },
  separator: {
    height: 5,
  },
  listcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  checkpointName: {
    fontSize: 25,
    fontWeight: '600',
    margin: 10,
    color: '#000',
  },
})
