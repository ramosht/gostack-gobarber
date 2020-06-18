import React, { useEffect } from 'react';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiInfo,
    FiXCircle,
} from 'react-icons/fi';
import * as S from './styled';
import { ToastMessage, useToast } from '../../../hooks/Toast';

interface ToastProps {
    toast: ToastMessage;
    style: object;
}

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
    const { removeToast } = useToast();

    const icons = {
        info: <FiInfo size={24} />,
        success: <FiCheckCircle size={24} />,
        error: <FiAlertCircle size={24} />,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [removeToast, toast.id]);

    return (
        <S.Toast
            type={toast.type}
            hasDescription={!!toast.description}
            style={style}
        >
            {icons[toast.type || 'info']}

            <div>
                <strong>{toast.title}</strong>
                {toast.description && <p>{toast.description}</p>}
            </div>

            <button type="button" onClick={() => removeToast(toast.id)}>
                <FiXCircle size={18} />
            </button>
        </S.Toast>
    );
};

export default Toast;
