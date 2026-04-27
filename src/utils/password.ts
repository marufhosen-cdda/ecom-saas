/**
 * Password utility functions for hashing and verification
 * Uses Web Crypto API compatible with Cloudflare Workers
 */

/**
 * Hash a password using SHA-256
 * @param password - Plain text password
 * @returns Hashed password as hex string
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashedPassword;
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hashed password
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    const hashToVerify = await hashPassword(password);
    return hashToVerify === hashedPassword;
}