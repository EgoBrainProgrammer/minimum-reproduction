import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function NumberStringMin(min: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'NumberStringMin',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: {
                message: propertyName + " must not be less than " + min,
                ...validationOptions
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Number.parseInt(value) > min;
                },
            },
        });
    };
}