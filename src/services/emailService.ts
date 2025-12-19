/**
 * Service to handle transactional emails using Resend or a similar API.
 */
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const emailService = {
    /**
     * Sends a donation receipt to the donor.
     */
    async sendDonationReceipt(data: {
        to: string;
        donorName: string;
        projectName: string;
        amount: number;
        currency: string;
    }) {
        if (!RESEND_API_KEY) {
            console.warn('Email Service: RESEND_API_KEY is not configured. Email will not be sent.');
            return;
        }

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'CrowdFund <receipts@yourdomain.com>',
                    to: [data.to],
                    subject: `Thank you for your donation to ${data.projectName}!`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <h2 style="color: #228b22;">Thank You, ${data.donorName}!</h2>
                            <p>We've successfully received your donation of <strong>${data.currency}${data.amount.toLocaleString()}</strong> for the project <strong>"${data.projectName}"</strong>.</p>
                            <p>Your support means a lot to the organizers and the community. You can track the project's progress on your dashboard.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #666;">This is an automated receipt for your donation. If you have any questions, please contact our support team.</p>
                            <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} CrowdFund Platform</p>
                        </div>
                    `
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send email');
            }

            return await response.json();
        } catch (error) {
            console.error('Email Service Error:', error);
            throw error;
        }
    }
};
