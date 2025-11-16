
export interface Character {
  id: string;
  name: string;
  image: string | null; // base64 encoded image string without data URI prefix
  imageMimeType: string | null;
  description: string;
  isLoading: boolean;
}
