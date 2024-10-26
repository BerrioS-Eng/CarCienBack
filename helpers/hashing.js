import {createHmac} from 'crypto';
import pkg from "bcryptjs";
const { hash, compare } = pkg;

export const doHash = (value, saltValue) => {
    const result = hash(value, saltValue);
    return result
}

export const doHashValidation = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result;
}

export const hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}