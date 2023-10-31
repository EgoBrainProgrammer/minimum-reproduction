import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, Includeable } from 'sequelize';
import { NOMINATION_REPOSITORY } from 'src/core/constants';
import { Nomination } from './entities/nomination.entity';
import { crudCreate, findAllExt } from 'src/core/utils/crud';
import { CreateNominationDto } from './dto/create.dto';

@Injectable()
export class NominationsService {
    constructor(@Inject(NOMINATION_REPOSITORY) private readonly repository: typeof Nomination) { }

    async findAll(findOptions: FindOptions, queryFindOptions: string | object = null): Promise<Nomination[]> {
        return await findAllExt(this.repository, findOptions, queryFindOptions);
    }

    async create(request, dto: CreateNominationDto): Promise<Nomination> {
        return await crudCreate(
            {
                request, 
                repository: this.repository, 
                findOptions: null, 
                dto,
                include: {
                    association: Nomination.associations.candidates
                }
            },
            {
                include: {
                    association: Nomination.associations.candidates
                }
            });
    }


}
