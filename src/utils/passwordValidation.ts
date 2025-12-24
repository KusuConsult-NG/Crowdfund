/**
 * Password validation utility for CrowdFund application
 * Provides password strength checking and validation against security requirements
 */

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordRequirement {
    label: string;
    met: boolean;
    regex: RegExp;
}

export interface PasswordValidationResult {
    isValid: boolean;
    requirements: PasswordRequirement[];
    strength: PasswordStrength;
    score: number;
}

/**
 * Password requirements configuration
 * These define the security policy for password creation
 */
const PASSWORD_REQUIREMENTS: Omit<PasswordRequirement, 'met'>[] = [
    {
        label: 'At least 8 characters',
        regex: /.{8,}/
    },
    {
        label: 'One uppercase letter',
        regex: /[A-Z]/
    },
    {
        label: 'One lowercase letter',
        regex: /[a-z]/
    },
    {
        label: 'One number',
        regex: /[0-9]/
    },
    {
        label: 'One special character (!@#$%^&*)',
        regex: /[!@#$%^&*(),.?":{}|<>]/
    }
];

/**
 * Calculate password strength based on multiple factors
 * Returns a score from 0-100
 */
export function calculatePasswordStrength(password: string): {
    strength: PasswordStrength;
    score: number;
} {
    let score = 0;

    // Length score (max 30 points)
    if (password.length >= 16) score += 30;
    else if (password.length >= 12) score += 20;
    else if (password.length >= 8) score += 10;

    // Character variety (max 40 points)
    if (/[a-z]/.test(password)) score += 10; // lowercase
    if (/[A-Z]/.test(password)) score += 10; // uppercase
    if (/[0-9]/.test(password)) score += 10; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 10; // special chars

    // Pattern complexity (max 30 points)
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 10) score += 15;
    else if (uniqueChars >= 8) score += 10;
    else if (uniqueChars >= 6) score += 5;

    // Bonus for mixed case and symbols (max 15 points)
    if (
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[^a-zA-Z0-9]/.test(password)
    ) {
        score += 15;
    }

    // Penalties
    // Repeated characters
    if (/(.)\1{2,}/.test(password)) score -= 10; // 3+ repeated chars
    // Sequential characters
    if (/abc|bcd|cde|123|234|345|678|789/.test(password.toLowerCase())) score -= 5;

    // Cap score at 100
    score = Math.max(0, Math.min(score, 100));

    // Determine strength level
    let strength: PasswordStrength;
    if (score >= 76) strength = 'strong';
    else if (score >= 51) strength = 'good';
    else if (score >= 26) strength = 'fair';
    else strength = 'weak';

    return { strength, score };
}

/**
 * Validate password against all requirements
 * Returns detailed validation results including which requirements are met
 */
export function validatePassword(password: string): PasswordValidationResult {
    // Check each requirement
    const requirements = PASSWORD_REQUIREMENTS.map(req => ({
        ...req,
        met: req.regex.test(password)
    }));

    // Password is valid if all requirements are met
    const isValid = requirements.every(req => req.met);

    // Calculate strength
    const { strength, score } = calculatePasswordStrength(password);

    return {
        isValid,
        requirements,
        strength,
        score
    };
}

/**
 * Get color for password strength level
 * Returns CSS variable name for consistent styling
 */
export function getStrengthColor(strength: PasswordStrength): string {
    switch (strength) {
        case 'strong':
            return 'var(--color-success)'; // Green
        case 'good':
            return '#F59E0B'; // Yellow/Amber
        case 'fair':
            return '#F97316'; // Orange
        case 'weak':
        default:
            return 'var(--color-error)'; // Red
    }
}

/**
 * Get background color for password strength level (lighter variant)
 */
export function getStrengthBackgroundColor(strength: PasswordStrength): string {
    switch (strength) {
        case 'strong':
            return 'rgba(34, 139, 34, 0.1)'; // Light green
        case 'good':
            return 'rgba(245, 158, 11, 0.1)'; // Light yellow
        case 'fair':
            return 'rgba(249, 115, 22, 0.1)'; // Light orange
        case 'weak':
        default:
            return 'rgba(239, 68, 68, 0.1)'; // Light red
    }
}
