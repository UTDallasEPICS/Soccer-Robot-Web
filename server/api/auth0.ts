import { nanoid } from "nanoid";

const state: {[key: string]: number}= {};
const getState = () => { const s = nanoid(); state[s] = 1; return s}
const runtime = useRuntimeConfig()

export const loginRedirectUrl = () => `${runtime.ISSUER}authorize?response_type=id_token&response_mode=form_post&client_id=${runtime.AUTH0_CLIENTID}&scope=openid%20email&redirect_uri=${encodeURIComponent(runtime.BASEURL!+"api/callback")}&nonce=${getState()}`

// Number used once
export const verifyNonce = (nonce: string) => {
    if (state[nonce]) {
        delete state[nonce]
        return true
    }
    return false
}