import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/Toast';
import Toast from './Toast';

import * as S from './styled';

interface ToastContainerProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
    const messagesWitTransictions = useTransition(
        messages,
        (message) => message.id,
        {
            from: { right: '-120%', opacity: 0 },
            enter: { right: '0%', opacity: 1 },
            leave: { right: '-120%', opacity: 0 },
        },
    );

    return (
        <S.Container>
            {messagesWitTransictions.map(({ item, key, props }) => (
                <Toast key={key} toast={item} style={props} />
            ))}
        </S.Container>
    );
};

export default ToastContainer;
