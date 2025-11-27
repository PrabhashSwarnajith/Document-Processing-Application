export interface UploadService {
  uploadFile(file: File, webhookUrl: string): Promise<unknown>;
}

class N8nUploadService implements UploadService {
  async uploadFile(file: File, webhookUrl: string): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    // Extract the path from the webhook URL to use the proxied endpoint
    const url = new URL(webhookUrl);
    const proxiedUrl = url.pathname + url.search; // Use relative path to proxy

    const response = await fetch(proxiedUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => response.statusText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} ${detail}`);
    }

    return await response.json();
  }
}

export const uploadService = new N8nUploadService();

