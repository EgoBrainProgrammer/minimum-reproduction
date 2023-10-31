import { NOMINATION_REPOSITORY } from "src/core/constants";
import { Nomination } from "./entities/nomination.entity";

export const nominationsProviders = [{
    provide: NOMINATION_REPOSITORY,
    useValue: Nomination,
}];