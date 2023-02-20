/**
 * Exclude fields form find methods
 */
exports.excludeFields = (keys = []) => {
    keys = typeof keys === "string" ? [keys] : keys ?? [];
    const defaultFields = { isVerified: 0, updatedAt: 0, createdAt: 0, OTP: 0, otpSentAt: 0, password: 0, isDeleted: 0 }
    keys.forEach(key => delete defaultFields[key]);

    return defaultFields;
}