import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStringOrNumArray(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsStringOrNumArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: {
                message: propertyName + " must be array of string or array of number",
                ...validationOptions
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Array.isArray(value) && value.reduce((a, b) => a && (typeof b === 'string' || typeof b === 'number') && !Array.isArray(b), true);
                },
            },
        });
    };
}