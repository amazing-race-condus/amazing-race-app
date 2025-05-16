import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
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
  }
})
