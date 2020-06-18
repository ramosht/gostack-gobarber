import React, { useRef, useCallback } from 'react';
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
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
    nome: string;
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleSignUp = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/users', data);

                Alert.alert(
                    'Cadastro realizado com sucesso',
                    'Você já pode fazer o login na aplicação',
                );

                navigation.goBack();
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }

                Alert.alert(
                    'Erro no cadastro',
                    'Ocorreu um erro ao fazer o cadastro. Cheque as informações.',
                );
            }
        },
        [navigation],
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

                        <S.Title>Crie sua conta</S.Title>

                        <Form ref={formRef} onSubmit={handleSignUp}>
                            <Input
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    emailInputRef.current?.focus()
                                }
                            />
                            <Input
                                ref={emailInputRef}
                                autoCapitalize="words"
                                autoCorrect={false}
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
                                Criar conta
                            </Button>
                        </Form>
                    </S.Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <S.BackToSignInButton onPress={() => navigation.goBack()}>
                <FeatherIcon name="arrow-left" size={18} color="#ff9000" />
                <S.BackToSignInButtonText>
                    Voltar ao logon
                </S.BackToSignInButtonText>
            </S.BackToSignInButton>
        </>
    );
};

export default SignIn;
