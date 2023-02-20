class APIError extends Error {
    constructor({ message, errors, status = 500, isPublic = true, stack, data }) {
        super(message);
        this.message = message;
        this.status = status;
        this.errors = errors;
        this.isPublic = isPublic;
        this.stack = stack;
        this.data = typeof data === 'string' ? [data]: data;
    }
}

module.exports = APIError;