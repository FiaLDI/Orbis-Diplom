export interface UploadState {
    loading: boolean;
    urls: string[];
    error?: string;
}

export interface UploadResponse {
    uploaded: string[];
}
