export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;

export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;

export const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY!;

export const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY!;

export const MAXIMUM_COMPLEXITY: number = 100;

export const MAXIMUM_SEED: number = 5;

export const DUMMY_PASSWORD: string = process.env.DUMMY_PASSWORD!;

export const SALT_ROUNDS: number = 10;

export const GMAIL_USER: string = process.env.GMAIL!;

export const GMAIL_PASSWORD: string = process.env.GMAIL_PASSWORD!;

export const DEFAULT_LOGIN_QUERY = `# Enter your email and password to login to receive your access token
mutation {
    login(email: "", password: "") {
        token
    }
}

# Replace <paste access token here> with your access token
# Paste the authorization header below in the 'HTTP HEADERS' tab at the bottom of the page for all your requests
# { "Authorization": "Bearer <paste access token here>" }
`;
