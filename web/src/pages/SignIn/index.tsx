import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import * as S from './styled';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';

// Components
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const history = useHistory();

    const { signIn } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
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

                history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }

                addToast({
                    type: 'error',
                    title: 'Deu um erro',
                    description: 'beibe beibe do biruleibe leibe',
                });
            }
        },
        [signIn],
    );

    return (
        <S.Container>
            <S.Content>
                <S.AnimationContainer>
                    <img src={logoImg} alt="GoBarber" title="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu logon</h1>

                        <Input
                            icon={FiMail}
                            name="email"
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Senha"
                            icon={FiLock}
                        />

                        <Button type="submit">Entrar</Button>

                        <a href="forgot">Esqueci minha senha</a>
                    </Form>

                    <Link to="signup">
                        <FiLogIn />
                        Criar conta
                    </Link>
                </S.AnimationContainer>
            </S.Content>
            <S.Background />
        </S.Container>
    );
};

export default SignIn;
