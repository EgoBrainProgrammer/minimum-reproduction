import { VOTE_REPOSITORY } from "src/core/constants";
import { Vote } from "./entities/vote.entity";

export const votesProviders = [{
    provide: VOTE_REPOSITORY,
    useValue: Vote,
}];