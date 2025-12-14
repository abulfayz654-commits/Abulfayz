export interface Student {
  id: string;
  name: string;
  role: string; // e.g., "Sinfboshi", "O'quvchi"
  photoUrl: string;
}

export interface Teacher {
  name: string;
  subject: string;
  photoUrl: string;
  phone: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export interface SiteConfig {
  heroTitle: string;
  motto: string;
  heroImage: string;
  location: string;
  lastEvent: string;
  lastEventDate: string;
  // Footer info
  creatorName: string;
  creatorPhone: string;
  telegramLink: string;
  instagramLink: string;
  youtubeLink: string;
}

export interface AppData {
  config: SiteConfig;
  teacher: Teacher;
  students: Student[];
  gallery: GalleryItem[];
}

export type ViewState = 'home' | 'people' | 'gallery' | 'chat' | 'admin';