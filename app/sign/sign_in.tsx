import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';


type LoginResponse = {
    success: boolean;
    message?: string;
};

const LoginModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};


    const handleLogin = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const response = await fetch('https://///////', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            const data: LoginResponse = await response.json();

            if (data.success) {
                router.push('/(tabs)/structure')
            } else {
                setErrorMessage(data.message || 'Неверные учетные данные.');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Произошла ошибка при попытке войти.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <View style={styles.modalContainer}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите ваш логин</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите пароль</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <CustomButton
                    title="Войти"
                    handlePress={handleLogin} />
            )}
            <CustomButton
                title="Закрыть"
                handlePress={() => setIsVisible(false)} />

        </View>

    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    image: {
        width: 142,
        height: 71,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '96%',
        height: 42,
        paddingVertical: 'auto',
        color: '#B3B3B3',
        textAlign: 'center',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default LoginModal;