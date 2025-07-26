// Interface for the Signup Form
export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export interface SignupForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: Gender;
    city: string;
    sports: string[];
}