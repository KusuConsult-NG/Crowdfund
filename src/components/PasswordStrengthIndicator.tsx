import React from 'react';
import {
    validatePassword,
    getStrengthColor,
    getStrengthBackgroundColor
} from '../utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
    password: string;
    showRequirements?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    showRequirements = true
}) => {
    // Don't show anything if password is empty
    if (!password) return null;

    const validation = validatePassword(password);
    const strengthColor = getStrengthColor(validation.strength);
    const strengthBgColor = getStrengthBackgroundColor(validation.strength);

    // Capitalize strength label
    const strengthLabel = validation.strength.charAt(0).toUpperCase() + validation.strength.slice(1);

    return (
        <div style={{ marginTop: '0.75rem' }}>
            {/* Strength Bar */}
            <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Password Strength:
                    </span>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: strengthColor
                    }}>
                        {strengthLabel} ({validation.score}%)
                    </span>
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${validation.score}%`,
                        height: '100%',
                        backgroundColor: strengthColor,
                        transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Requirements checklist */}
            {showRequirements && (
                <div style={{
                    padding: '0.75rem',
                    backgroundColor: strengthBgColor,
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${strengthColor}33`
                }}>
                    <p style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: 'var(--color-text-primary)'
                    }}>
                        Requirements:
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: '0.375rem'
                    }}>
                        {validation.requirements.map((req, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {/* Checkmark or X icon */}
                                {req.met ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="var(--color-success)"
                                        viewBox="0 0 256 256"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="var(--color-error)"
                                        viewBox="0 0 256 256"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                    </svg>
                                )}
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: req.met ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    textDecoration: req.met ? 'none' : 'none'
                                }}>
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
