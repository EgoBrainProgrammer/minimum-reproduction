import { EntityHistory } from './entityhistory.entity';
import { ENTITYHISTORY_REPOSITORY, ENTITYEDIT_REPOSITORY } from '../../core/constants';
import { EntityEdit } from './entityedit.entity';

export const entityHistoryProviders = [{
    provide: ENTITYHISTORY_REPOSITORY,
    useValue: EntityHistory,
},
{
    provide: ENTITYEDIT_REPOSITORY,
    useValue: EntityEdit,
}];