// Fluxo de cadastro de usuário
import React from 'react';
import {SignupForm, Gender} from '../interfaces/SigupForm';
export default function useSignup() {
    const [form, setForm] = React.useState<SignupForm>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 0,
        gender: null,
        city: '',
        sports: [],
    });

    return {
        form,
        setForm
    };
}
