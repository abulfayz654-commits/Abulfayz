import { AppData, Student, Teacher, GalleryItem, SiteConfig } from '../types';

const STORAGE_KEY = '9b_class_data_v2'; // Version bumped to v2 for new schema

const DEFAULT_DATA: AppData = {
  config: {
    heroTitle: "9-B Sinfga Xush Kelibsiz!",
    motto: "Bilim - kelajak poydevori, Biz esa kelajak bunyodkorlarimiz!",
    heroImage: "https://picsum.photos/id/180/1200/600",
    location: "Toshkent shahar, 45-maktab, 2-qavat, 204-xona",
    lastEvent: "Navro'z bayrami sayli",
    lastEventDate: "21-Mart, 2024",
    creatorName: "Shodiyev Abulfayz",
    creatorPhone: "+998 70 117 66 07",
    telegramLink: "https://t.me/",
    instagramLink: "https://instagram.com/",
    youtubeLink: "https://youtube.com/"
  },
  teacher: {
    name: "Aziza Karimova",
    subject: "Matematika va Informatika",
    photoUrl: "https://picsum.photos/id/64/300/300",
    phone: "+998 90 123 45 67"
  },
  students: [
    { id: '1', name: "Abulfayz Shodiyev", role: "Sinfboshi", photoUrl: "https://picsum.photos/id/1005/200/200" },
    { id: '2', name: "Jasur Rahimov", role: "Sport yetakchisi", photoUrl: "https://picsum.photos/id/1011/200/200" },
    { id: '3', name: "Malika Adilova", role: "Madaniy ishlar", photoUrl: "https://picsum.photos/id/338/200/200" },
    { id: '4', name: "Bekzod Aliyev", role: "O'quvchi", photoUrl: "https://picsum.photos/id/334/200/200" },
    { id: '5', name: "Diyora Saidova", role: "O'quvchi", photoUrl: "https://picsum.photos/id/342/200/200" },
  ],
  gallery: [
    { id: '1', imageUrl: "https://picsum.photos/id/20/800/600", caption: "Kompyuter darsida", date: "10-Sentabr" },
    { id: '2', imageUrl: "https://picsum.photos/id/145/800/600", caption: "Futbol musobaqasi", date: "15-Oktabr" },
    { id: '3', imageUrl: "https://picsum.photos/id/201/800/600", caption: "Muzeyga sayohat", date: "2-Noyabr" },
  ]
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with default to ensure new fields exist if loading old data
      return {
        ...DEFAULT_DATA,
        ...parsed,
        config: { ...DEFAULT_DATA.config, ...parsed.config }
      };
    } catch (e) {
      console.error("Failed to parse stored data", e);
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};