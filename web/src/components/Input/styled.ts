import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #232129;
    border-radius: 10px;
    border: 2px solid #232129;
    padding: 16px;
    width: 100%;
    color: #666360;
    display: flex;
    align-items: center;
    transition: border-color 0.2s;

    & + div {
        margin-top: 8px;
    }

    ${(props) =>
        props.isErrored &&
        css`
            border-color: #c53030;
        `}

    ${(props) =>
        props.isFocused &&
        css`
            border-color: #ff9000;

            svg {
                color: #ff9000;
            }
        `}

    ${(props) =>
        props.isFilled &&
        css`
            svg {
                color: #ff9000;
            }
        `}

    input {
        background: transparent;
        border: none;
        flex: 1;
        color: #f4ede8;

        &::placeholder {
            color: #666360;
        }
    }

    svg {
        margin-right: 16px;
        transition: color 0.2s;
    }
`;

export const Error = styled(Tooltip)`
    height: 20px;
    margin-left: 16px;

    svg {
        margin: 0;
    }

    span {
        background: #c53030;
        color: #fff;

        &:before {
            border-color: #c53030 transparent;
        }
    }
`;
