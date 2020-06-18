import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import * as S from './styled';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';

// Components
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();

    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: object) => {
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

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'Cadastrado com sucesso',
                    description: 'Agora é só fazer o login!',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }
            }
        },
        [history, addToast],
    );

    return (
        <S.Container>
            <S.Content>
                <S.AnimationContainer>
                    <img src={logoImg} alt="GoBarber" title="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>

                        <Input icon={FaUser} name="name" placeholder="Nome" />
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

                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Fazer logon
                    </Link>
                </S.AnimationContainer>
            </S.Content>
            <S.Background />
        </S.Container>
    );
};

export default SignUp;
