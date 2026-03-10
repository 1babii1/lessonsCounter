import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill all fields');
            return;
        }
        setLoading(true);
        setError('');

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={styles.title}>LessonsCounter</Text>
            <Text style={styles.subtitle}>Login to an existing account</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        padding: 20,
    },
    themeToggle: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: theme.surface,
        color: theme.text,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.border,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.border,
    },
    passwordInput: {
        flex: 1,
        color: theme.text,
        padding: 15,
    },
    eyeIcon: {
        padding: 15,
    },
    button: {
        backgroundColor: theme.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: theme.primary,
        fontSize: 14,
    },
    errorText: {
        color: theme.error,
        textAlign: 'center',
        marginBottom: 15,
    }
});
