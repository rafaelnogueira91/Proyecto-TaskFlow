import { StyleSheet, Platform } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  wrapper: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  brand: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  tagline: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: '#E6ECF5',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 30px rgba(23,43,77,0.06)',
      },
      default: {
        elevation: 3,
      },
    }),
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344563',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#DCE5F1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#172B4D',
    marginBottom: 20,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5F1',
    borderRadius: 10,
    minHeight: 50,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#172B4D',
  },

  showButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  showText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
  },

  errorBox: {
    backgroundColor: '#FFF1F1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    color: '#C53030',
    fontSize: 13,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#4A90E2',
    minHeight: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 5,
  },

  registerText: {
    fontSize: 13,
    color: '#718096',
  },

  registerLink: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 28,
  },
});
