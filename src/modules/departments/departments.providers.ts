import { Department } from './entities/department.entity';
import { DEPARTMENT_REPOSITORY } from '../../core/constants';

export const departmentsProviders = [{
    provide: DEPARTMENT_REPOSITORY,
    useValue: Department,
}];