import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import * as S from './styled';

interface ButtonProps extends RectButtonProperties {
    children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
    <S.Container {...rest}>
        <S.ButtonText>{children}</S.ButtonText>
    </S.Container>
);

export default Button;
