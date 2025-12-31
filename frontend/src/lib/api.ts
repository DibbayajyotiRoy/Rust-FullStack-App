export class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
    }
    // Handle 204 No Content
    if (response.status === 204) {
        return null as T;
    }
    return response.json();
}

export const api = {
    get: async <T>(url: string): Promise<T> => {
        const response = await fetch(url);
        return handleResponse<T>(response);
    },

    post: async <T>(url: string, body?: unknown): Promise<T> => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    put: async <T>(url: string, body?: unknown): Promise<T> => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    delete: async <T>(url: string): Promise<T> => {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        return handleResponse<T>(response);
    },
};
