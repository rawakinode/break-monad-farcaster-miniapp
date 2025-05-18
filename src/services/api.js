import axios from 'axios';
import { sdk } from '@farcaster/frame-sdk'
import { generateRandomString } from "../utils/utility";

export const login = async () => {
    try {
        const domain = 'moneticle.rawaki.xyz'
        const nonce = generateRandomString(20);
        const sign = await sdk.actions.signIn({ 
            nonce,
            acceptAuthAddress: true
        });

        const response = await axios.post('https://api.rawaki.xyz/login', { domain, nonce, message: sign.message, signature: sign.signature});
        const token = response.data.token;
        sessionStorage.setItem('token', token);
        return true;
    } catch (error) {
        return error;
    }
}