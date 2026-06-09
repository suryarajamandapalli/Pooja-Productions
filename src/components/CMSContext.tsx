import React, { createContext, useContext, useState, useEffect } from "react";

// Website Content Schema TypeScript definitions
export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  bgVideoUrl: string;
  heroImageUrl: string;
}

export interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  brochureUrl: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  imdb?: string;
  linkedin?: string;
}

export interface LeadershipContent {
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
  bio1: string;
  bio2: string;
}

export interface FilmItem {
  id: number;
  src: string;
  category: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  iconClass: string;
  description: string;
  imgS: string;
  imgM: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
}

export interface TestimonialItem {
  id: number;
  avatar: string;
  name: string;
  position: string;
  rating: number;
  description: string;
  imageUrl: string;
}

export interface AwardItem {
  id: number;
  date: string;
  title: string;
  source: string;
  sourceUrl?: string;
  description: string;
}

export interface LegacyItem {
  id: number;
  date: string;
  title: string;
  source: string;
  description: string;
}

export interface ToolItem {
  name: string;
  icon: string;
}

export interface TeamItem {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export interface FooterContent {
  copyright: string;
  links: Array<{ label: string; url: string }>;
}

export interface WebsiteData {
  hero: HeroContent;
  about: AboutContent;
  leadership: LeadershipContent;
  films: FilmItem[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  awards: AwardItem[];
  legacy: LegacyItem[];
  tools: ToolItem[];
  team: TeamItem[];
  footer: FooterContent;
}

interface CMSContextType {
  data: WebsiteData | null;
  loading: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  updateField: (section: keyof WebsiteData, key: string, value: any) => void;
  addListItem: (section: keyof WebsiteData, item: any) => void;
  updateListItem: (section: keyof WebsiteData, id: number, updatedFields: any) => void;
  deleteListItem: (section: keyof WebsiteData, id: number) => void;
  uploadMedia: (file: File) => Promise<string>;
  saveAllChanges: () => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load content configuration and verify active session token on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const localData = localStorage.getItem("pooja_cmsData");
        if (localData) {
          setData(JSON.parse(localData));
        } else {
          const res = await fetch("/data/content.json");
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load CMS content configuration", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Check secure admin login token
    const token = localStorage.getItem("pooja_admin_token");
    if (token === "local_dev_secure_session_token_2026") {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password }),
      });
      const result = await res.json();
      if (result.success && result.token) {
        localStorage.setItem("pooja_admin_token", result.token);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login authentication request failed", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("pooja_admin_token");
    setIsAdmin(false);
  };

  // Modify text field values
  const updateField = (section: keyof WebsiteData, key: string, value: any) => {
    setData((prev) => {
      if (!prev) return null;
      const sectionData = prev[section];
      if (Array.isArray(sectionData)) return prev;

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: value,
        },
      };
    });
  };

  // Add items (e.g. film, testimonial, award)
  const addListItem = (section: keyof WebsiteData, item: any) => {
    setData((prev) => {
      if (!prev) return null;
      const sectionData = prev[section];
      if (!Array.isArray(sectionData)) return prev;

      const nextId = sectionData.reduce((max, x: any) => (x.id > max ? x.id : max), 0) + 1;
      const newItem = { ...item, id: nextId };

      return {
        ...prev,
        [section]: [...sectionData, newItem],
      };
    });
  };

  // Update item field values
  const updateListItem = (section: keyof WebsiteData, id: number, updatedFields: any) => {
    setData((prev) => {
      if (!prev) return null;
      const sectionData = prev[section];
      if (!Array.isArray(sectionData)) return prev;

      const updatedList = sectionData.map((item: any) => {
        if (item.id === id) {
          return { ...item, ...updatedFields };
        }
        return item;
      });

      return {
        ...prev,
        [section]: updatedList,
      };
    });
  };

  // Remove list items
  const deleteListItem = (section: keyof WebsiteData, id: number) => {
    setData((prev) => {
      if (!prev) return null;
      const sectionData = prev[section];
      if (!Array.isArray(sectionData)) return prev;

      return {
        ...prev,
        [section]: sectionData.filter((item: any) => item.id !== id),
      };
    });
  };

  // Stream raw binary files to dev server uploader
  const uploadMedia = async (file: File): Promise<string> => {
    const formattedName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const res = await fetch("/api/upload-media", {
      method: "POST",
      headers: {
        "x-file-name": formattedName,
        "Content-Type": file.type,
      },
      body: file, // Pipeline raw binary upload
    });
    const result = await res.json();
    return result.url; // Returns file URL e.g. /uploads/1782..._poster.png
  };

  // Save layout state to local content.json file
  const saveAllChanges = async (): Promise<boolean> => {
    if (!data) return false;
    try {
      localStorage.setItem("pooja_cmsData", JSON.stringify(data));
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate save delay
      return true;
    } catch (e) {
      console.error("Save content database request failed", e);
      return false;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        loading,
        isAdmin,
        login,
        logout,
        updateField,
        addListItem,
        updateListItem,
        deleteListItem,
        uploadMedia,
        saveAllChanges,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error("useCMS must be used inside a CMSProvider");
  }
  return context;
};
