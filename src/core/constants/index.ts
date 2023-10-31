export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

//--REPOSITORIES--
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';
export const USERROLE_REPOSITORY = 'USERROLE_REPOSITORY';
export const REFRESHTOKEN_REPOSITORY = 'REFRESHTOKEN_REPOSITORY';
export const DEPARTMENT_REPOSITORY = 'DEPARTMENT_REPOSITORY';
export const ENTITYHISTORY_REPOSITORY = 'ENTITYHISTORY_REPOSITORY';
export const ENTITYEDIT_REPOSITORY = 'ENTITYEDIT_REPOSITORY';

export const NOMINATION_REPOSITORY = 'NOMINATION_REPOSITORY';
export const CANDIDATE_REPOSITORY = 'CANDIDATE_REPOSITORY';
export const VOTE_REPOSITORY = 'VOTE_REPOSITORY';

//--LOG--
export const LOGGING = {
    DIR: "log",    
    MAIN: {
        FILE: "combined.log",
        MAXSIZE: 10485760
    },
    ERROR: {
        FILE: "error.log",
        MAXSIZE: 10485760
    },
    SQL: {
        FILE: "sql.log",
        MAXSIZE: 10485760
    },
    HTTP: {
        FILE: "http.log",
        MAXSIZE: 10485760
    },
    WS: {
        FILE: "ws.log",
        MAXSIZE: 10485760
    }
}