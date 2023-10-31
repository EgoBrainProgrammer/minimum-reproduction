import { CANDIDATE_REPOSITORY } from "src/core/constants";
import { Candidate } from "./entities/candidate.entity";

export const candidatesProviders = [{
    provide: CANDIDATE_REPOSITORY,
    useValue: Candidate,
}];