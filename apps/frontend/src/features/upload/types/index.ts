export interface UploadResponse {
    uploaded: string[];
}

export interface UploadFileState {
    name: string;
    progress: number;
    url?: string;
    error?: string;
}

export interface UploadState {
    files: UploadFileState[];
    overallProgress: number;
    loading: boolean;
    error?: string;
}
