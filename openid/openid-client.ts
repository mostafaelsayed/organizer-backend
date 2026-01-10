import { Response } from 'express';
import * as client from 'openid-client'
import url from 'url';
import { createOauthUser } from '../services/user-service';

// Prerequisites

let server: URL = new URL('https://accounts.google.com/.well-known/openid-configuration'); // Authorization server's Issuer Identifier URL
let clientId: string = process.env.OAUTH_CLIENT_ID || '';
let clientSecret: string = process.env.OAUTH_CLIENT_SECRET || '';
/**
 * Value used in the authorization request as redirect_uri pre-registered at the
 * Authorization Server.
 */
let signup_redirect_uri: string = ('http://localhost:5173/oauthsignup');
let login_redirect_uri: string = ('http://localhost:5173/oauthlogin');

// End of prerequisites

export async function init() {
    let config = await client.discovery(server, clientId, clientSecret);

    return config;
}

export async function googlesignup(req: any, res: any) {
    console.log('req body: ', JSON.stringify(req.body));
    console.log('req url: ', req.query);
    let x = url.parse(req.url).query;
    console.log('x: ', x);
    // one eternity later, the user lands back on the redirect_uri
    // Authorization Code Grant
    let sub: string
    let access_token: string
    try {
        // let currentUrl: URL = getCurrentUrl()
        let config = await init();
        let tokens = await client.authorizationCodeGrant(config, new URL(signup_redirect_uri + '?' + x), {
            pkceCodeVerifier: req.session.user.code_verifier,
            expectedNonce: req.session.user.nonce,
            idTokenExpected: true,
        });

        console.log('Token Endpoint Response', tokens);
        ({ access_token } = tokens)
        let claims = tokens.claims()!
        console.log('ID Token Claims', claims);
        ({ sub } = claims)


        // UserInfo Request

        let userInfo = await client.fetchUserInfo(config, access_token, sub)

        const user = await createOauthUser(String(userInfo.email), String(userInfo.given_name), String(userInfo.family_name), String(userInfo.phone_number));

        req.session.user = user;

        console.log('UserInfo Response', userInfo);
    }
    catch(e) {
        console.error('er: ', JSON.stringify(e));
    }
}

export async function googlesignin(req: any, res: any) {
    console.log('req body: ', JSON.stringify(req.body));
    console.log('req url: ', req.query);
    let x = url.parse(req.url).query;
    console.log('x: ', x);
    // one eternity later, the user lands back on the redirect_uri
    // Authorization Code Grant
    let sub: string
    let access_token: string
    try {
        // let currentUrl: URL = getCurrentUrl()
        let config = await init();
        let tokens = await client.authorizationCodeGrant(config, new URL(login_redirect_uri + '?' + x), {
            pkceCodeVerifier: req.session.user.code_verifier,
            expectedNonce: req.session.user.nonce,
            idTokenExpected: true,
        });

        console.log('Token Endpoint Response', tokens);
        ({ access_token } = tokens)
        let claims = tokens.claims()!
        console.log('ID Token Claims', claims);
        ({ sub } = claims)


        // UserInfo Request

        let userInfo = await client.fetchUserInfo(config, access_token, sub)

        console.log('UserInfo Response', userInfo)
    }
    catch(e) {
        console.error('er: ', JSON.stringify(e));
    }
}

export async function openidSignup(req: any, res: Response) {
    let config = await client.discovery(server, clientId, clientSecret)

    let code_challenge_method = 'S256'
    /**
     * The following (code_verifier and potentially nonce) MUST be generated for
     * every redirect to the authorization_endpoint. You must store the
     * code_verifier and nonce in the end-user session such that it can be recovered
     * as the user gets redirected from the authorization server back to your
     * application.
     */
    let code_verifier = client.randomPKCECodeVerifier()
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
    let nonce!: string


    // redirect user to as.authorization_endpoint
    let parameters: Record<string, string> = {
        redirect_uri: signup_redirect_uri,
        scope: 'openid email',
        code_challenge,
        code_challenge_method,
    }

    /**
     * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use
     * of PKCE is backwards compatible even if the AS doesn't support it which is
     * why we're using it regardless.
     */
    if (!config.serverMetadata().supportsPKCE()) {
        nonce = client.randomNonce()
        parameters.nonce = nonce
    }

    req.session.user = {
        nonce,
        code_verifier
    }

    


    let redirectTo = client.buildAuthorizationUrl(config, parameters)

    console.log('redirecting to', redirectTo.href);
    // now redirect the user to redirectTo.href

    req.session.save((err: any) => {
        if (!err) {
            res.send({ redirect: redirectTo.href });
        }
        else {
            console.error('error saving sess: ', err);
        }
    });
    

}

export async function openidLogin(req: any, res: Response) {
    let config = await client.discovery(server, clientId, clientSecret)

    let code_challenge_method = 'S256'
    /**
     * The following (code_verifier and potentially nonce) MUST be generated for
     * every redirect to the authorization_endpoint. You must store the
     * code_verifier and nonce in the end-user session such that it can be recovered
     * as the user gets redirected from the authorization server back to your
     * application.
     */
    let code_verifier = client.randomPKCECodeVerifier()
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
    let nonce!: string


    // redirect user to as.authorization_endpoint
    let parameters: Record<string, string> = {
        redirect_uri: login_redirect_uri,
        scope: 'openid email',
        code_challenge,
        code_challenge_method,
    }

    /**
     * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use
     * of PKCE is backwards compatible even if the AS doesn't support it which is
     * why we're using it regardless.
     */
    if (!config.serverMetadata().supportsPKCE()) {
        nonce = client.randomNonce()
        parameters.nonce = nonce
    }

    req.session.user = {
        nonce,
        code_verifier
    }

    


    let redirectTo = client.buildAuthorizationUrl(config, parameters)

    console.log('redirecting to', redirectTo.href);
    // now redirect the user to redirectTo.href

    req.session.save((err: any) => {
        if (!err) {
            res.send({ redirect: redirectTo.href });
        }
        else {
            console.error('error saving sess: ', err);
        }
    });
    

}