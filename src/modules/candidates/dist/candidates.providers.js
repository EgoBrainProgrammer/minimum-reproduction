"use strict";
exports.__esModule = true;
exports.candidatesProviders = void 0;
var constants_1 = require("src/core/constants");
var candidate_entity_1 = require("./entities/candidate.entity");
exports.candidatesProviders = [{
        provide: constants_1.CANDIDATE_REPOSITORY,
        useValue: candidate_entity_1.Candidate
    }];
