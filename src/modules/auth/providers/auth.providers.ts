
import { REFRESHTOKEN_REPOSITORY } from '../../../core/constants';
import { RefreshToken } from '../entities/refreshtoken.entity';
import { Issuer, generators } from 'openid-client';

export const authProviders = [{
    provide: REFRESHTOKEN_REPOSITORY,
    useValue: RefreshToken,
},
{
    provide: "OpenIdClient",
    useFactory: async () => {        
        let TrustIssuer = null;
        const result = {
            client: null,
            code_verifier: null,
        }

        try {
            TrustIssuer = await Issuer.discover(process.env.OPENID_PROVIDER);
        } catch (ex) {
            console.error(ex);
        }

        if(TrustIssuer) {
            result.code_verifier = generators.codeVerifier();
            const code_challenge = generators.codeChallenge(result.code_verifier);
            result.client = new TrustIssuer.Client({
                client_id: process.env.OPENID_CLIENTID,
                client_secret: process.env.OPENID_CLIENTSECRET,
                redirect_uris: JSON.parse(process.env.OPENID_REDIRECT_URLS),
                response_types: ['code'],
            });
            result.client.authorizationUrl({
                scope: process.env.OPENID_SCOPE,
                resource: JSON.parse(process.env.OPENID_REDIRECT_URLS)[0],
                code_challenge,
                code_challenge_method: 'S256',
              });
        }

        return result;
    }
}];