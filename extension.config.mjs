import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv';
dotenv.config();

export default {
    plugins: [
        replace({
            '__CDN_API_URL__' : process.env.CDN_API_URL,
            '__CDN_API_KEY__' : process.env.CDN_API_KEY,
        })
    ],
};


