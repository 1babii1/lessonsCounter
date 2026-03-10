import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import api from '../api/config';

export default function VerifyScreen({ route, navigation }) {
  const { token } = route.params || {};
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    api
      .get(`/auth/verify/${token}`)
      .then(() => {
        setStatus('success');
        // after a short delay, redirect to login
        setTimeout(() => navigation.navigate('Login'), 2000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token]);

  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" />}
      {status === 'success' && (
        <>
          <Text style={styles.message}>Email verified! Redirecting to login...</Text>
        </>
      )}
      {status === 'error' && (
        <>
          <Text style={styles.message}>Verification failed or link is invalid.</Text>
          <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});