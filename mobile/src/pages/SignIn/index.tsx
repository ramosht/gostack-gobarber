import React, { useCallback, useRef } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import * as S from './styled';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navgation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const { signIn, user } = useAuth();

    console.log(user);

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors([]);

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Necessário incerir um e-mail')
                        .email('Necessário inserir um e-mail válido'),
                    password: Yup.string().min(6, 'Senha obrigatória'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                signIn({ email: data.email, password: data.password });

                // history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }

                Alert.alert(
                    'Erro na autenticação',
                    'Ocorreu um erro ao fazer o login. Cheque as credenciais.',
                );
            }
        },
        [signIn],
    );

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <S.Container>
                        <Image source={logoImg} />

                        <S.Title>Faça seu logon</S.Title>

                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordInputRef.current?.focus()
                                }
                            />
                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                returnKeyType="send"
                                onSubmitEditing={() =>
                                    formRef.current?.submitForm()
                                }
                            />
                            <Button
                                onPress={() => formRef.current?.submitForm()}
                            >
                                Entrar
                            </Button>
                        </Form>
                        <S.ForgotPassword
                            onPress={() => {
                                console.log('teste');
                            }}
                        >
                            <S.ForgotPasswordText>
                                Esqueci minha senha
                            </S.ForgotPasswordText>
                        </S.ForgotPassword>
                    </S.Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <S.CreateAccountButton onPress={() => navgation.navigate('SignUp')}>
                <FeatherIcon name="log-in" size={18} color="#ff9000" />
                <S.CreateAccountButtonText>
                    Criar uma conta
                </S.CreateAccountButtonText>
            </S.CreateAccountButton>
        </>
    );
};

export default SignIn;
