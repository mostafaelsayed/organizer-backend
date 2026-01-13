import { Response } from 'express';
import * as client from 'openid-client'
import url from 'url';
import { createOauthUser } from '../services/user-service';
import { User } from '../models/models';

let localSecrets: any = {};

if (!process.env.OAUTH_CLIENT_ID) {
    localSecrets = require('../secrets.json')
}

// Prerequisites

let server: URL = new URL('https://accounts.google.com/.well-known/openid-configuration'); // Authorization server's Issuer Identifier URL
let clientId: string = process.env.OAUTH_CLIENT_ID || localSecrets.OAUTH_CLIENT_ID;
let clientSecret: string = process.env.OAUTH_CLIENT_SECRET || localSecrets.OAUTH_CLIENT_SECRET;
/**
 * Value used in the authorization request as redirect_uri pre-registered at the
 * Authorization Server.
 */
let signup_redirect_uri: string = ((process.env.FRONTEND_ORIGIN || 'http://localhost:5173') + '/oauthsignup');
let login_redirect_uri: string = ((process.env.FRONTEND_ORIGIN || 'http://localhost:5173') + '/oauthlogin');

// End of prerequisites

export async function init() {
    let config = await client.discovery(server, clientId, clientSecret);

    return config;
}

export async function googlesignup(req: any): Promise<User | undefined> {
    let x = url.parse(req.url).query;
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

        ({ access_token } = tokens)
        let claims = tokens.claims()!;
        ({ sub } = claims)


        // UserInfo Request

        let userInfo = await client.fetchUserInfo(config, access_token, sub)

        const user = await createOauthUser(String(userInfo.email), userInfo.given_name, userInfo.family_name, userInfo.phone_number)
        req.session.user = user;

        return user;
    }
    catch(e) {
        console.error('er: ', JSON.stringify(e));
    }
}

export async function googlesignin(req: any, res: any): Promise<User | undefined> {
    let x = url.parse(req.url).query;
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

        ({ access_token } = tokens)
        let claims = tokens.claims()!;
        ({ sub } = claims)


        // UserInfo Request

        let userInfo = await client.fetchUserInfo(config, tokens.access_token, claims.sub)

        const userRecord: User | null = await User.findOne({ where: { email: userInfo.email } });
        if (!userRecord) {
            return undefined;
        }

        req.session.user = userRecord;

        return userRecord;
    }
    catch(e: any) {
        console.error('er: ', e.stack);
        console.error('eror : ', e);
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

    req.session.save((err: any) => {
        if (!err) {
            res.send({ redirect: redirectTo.href });
        }
        else {
            console.error('error saving sess: ', err);
        }
    });
}