import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { setNativeProps } from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';

type RegisterResponse = {
    success: boolean;
    message?: string;
};

const RegistrationModal = () => {
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


    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage('');

            const response = await fetch('https://////////////////', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, organization, phone, confirmPassword, name }),
            });

            const data: RegisterResponse = await response.json();

            if (data.success) {
                alert('Успешная регистрация!');
                setIsVisible(false);
            } else {
                setErrorMessage(data.message || 'Произошла ошибка при регистрации');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Произошла ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (

        <View style={styles.modalContainer}>
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>ФИО</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Организация</Text>
            <TextInput
                style={styles.input}
                value={organization}
                onChangeText={(text) => setOrganization(text)}
            />
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Телефон</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(text) => setPhone(text)}
            />
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите ваш Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите пароль</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Подтвердите пароль</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <CustomButton
                    title="Зарегистрироваться"
                    handlePress={handleRegister} />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
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

export default RegistrationModal;