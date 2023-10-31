import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsArrayStringOfInteger(min?: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsArrayStringOfInteger',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: {
                message: propertyName + " must be an string array of integers like [1, 2, 3...]",
                ...validationOptions
            },
            validator: {
                validate(value: string, args: ValidationArguments) {
                    if(!new RegExp(/^\[ *\d *,( *\d,)* *\d\ *\]$/gm).test(value))
                        return false;
                    
                    const result = value.replace('[', '').replace(']', '').split(',');
                    return result.reduce((ac, lv) => ac && Number.isInteger(Number(lv)) && 
                        (min ? Number(lv) > min : true), true);
                },
            },
        });
    };
}