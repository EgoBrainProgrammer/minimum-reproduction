
import { IsString } from 'class-validator';
import { ParamIdDto } from './param.id.dto';

export class ParamsIdAttrDto extends ParamIdDto {
    @IsString()
    attr: string;
}
