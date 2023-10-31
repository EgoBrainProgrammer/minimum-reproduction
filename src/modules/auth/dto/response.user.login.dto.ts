import { Transform } from "class-transformer";
import { ResponseUserDto } from "../../users/dto/response.user.dto";

export class ResponseUserLoginDto {
    @Transform(({ value }) => {
        const result = new ResponseUserDto(value.toJSON());
        if(result.hasOwnProperty("roles") && Array.isArray(result["roles"]))
            result["roles"] = result["roles"].map(x => x.name);
        // const result = new ResponseUserDto(value.toJSON && typeof value.toJSON == "function" ? value.toJSON() : value);
        // if(result.hasOwnProperty("roles") && Array.isArray(result["roles"]))
        //     result["roles"] = result["roles"].map(x => typeof x == "object" ? x.name : x);
        return result;
    })
    readonly user: Object;

    readonly token: string;
    
    readonly refreshToken: string;

    constructor(partial) {
        Object.assign(this, partial);
    }
}