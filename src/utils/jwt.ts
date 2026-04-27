import * as jose from "jose";

/**
 * JWT Token Utilities using Jose
 * Compatible with Cloudflare Workers and Edge Runtime
 */

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Helper to get secret as Uint8Array
const getSecretKey = (secret: string): Uint8Array => {
	return new TextEncoder().encode(secret);
};

/**
 * Generate Access Token
 * Short-lived token for API authentication
 */
export async function generateAccessToken(
	payload: {
		userId: number;
		email: string;
		role: string;
	},
	secret: string,
): Promise<string> {
	const secretKey = getSecretKey(secret);

	const token = await new jose.SignJWT({
		userId: payload.userId,
		email: payload.email,
		role: payload.role,
		type: "access",
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(ACCESS_TOKEN_EXPIRY)
		.setSubject(payload.userId.toString())
		.sign(secretKey);

	return token;
}

/**
 * Generate Refresh Token
 * Long-lived token for token rotation
 */
export async function generateRefreshToken(
	payload: {
		userId: number;
		sessionId: string;
	},
	secret: string,
): Promise<string> {
	const secretKey = getSecretKey(secret);

	const token = await new jose.SignJWT({
		userId: payload.userId,
		sessionId: payload.sessionId,
		type: "refresh",
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(REFRESH_TOKEN_EXPIRY)
		.setSubject(payload.userId.toString())
		.sign(secretKey);

	return token;
}

/**
 * Verify Access Token
 */
export async function verifyAccessToken(
	token: string,
	secret: string,
): Promise<{
	userId: number;
	email: string;
	role: string;
	type: string;
}> {
	try {
		const secretKey = getSecretKey(secret);
		const { payload } = await jose.jwtVerify(token, secretKey);

		if (payload.type !== "access") {
			throw new Error("Invalid token type");
		}

		return {
			userId: payload.userId as number,
			email: payload.email as string,
			role: payload.role as string,
			type: payload.type as string,
		};
	} catch (error) {
		if (error instanceof jose.errors.JWTExpired) {
			throw new Error("Access token expired");
		}
		throw new Error("Invalid or expired access token");
	}
}

/**
 * Verify Refresh Token
 */
export async function verifyRefreshToken(
	token: string,
	secret: string,
): Promise<{
	userId: number;
	sessionId: string;
	type: string;
}> {
	try {
		const secretKey = getSecretKey(secret);
		const { payload } = await jose.jwtVerify(token, secretKey);

		if (payload.type !== "refresh") {
			throw new Error("Invalid token type");
		}

		return {
			userId: payload.userId as number,
			sessionId: payload.sessionId as string,
			type: payload.type as string,
		};
	} catch (error) {
		if (error instanceof jose.errors.JWTExpired) {
			throw new Error("Refresh token expired");
		}
		throw new Error("Invalid or expired refresh token");
	}
}

/**
 * Calculate expiration date from now
 */
export function calculateExpiryDate(expiryString: string): Date {
	const now = new Date();
	const match = expiryString.match(/^(\d+)([smhd])$/);

	if (!match) {
		throw new Error("Invalid expiry format");
	}

	const value = parseInt(match[1], 10);
	const unit = match[2];

	switch (unit) {
		case "s":
			now.setSeconds(now.getSeconds() + value);
			break;
		case "m":
			now.setMinutes(now.getMinutes() + value);
			break;
		case "h":
			now.setHours(now.getHours() + value);
			break;
		case "d":
			now.setDate(now.getDate() + value);
			break;
		default:
			throw new Error("Invalid time unit");
	}

	return now;
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
	if (!authHeader) {
		return null;
	}

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		return null;
	}

	return parts[1];
}