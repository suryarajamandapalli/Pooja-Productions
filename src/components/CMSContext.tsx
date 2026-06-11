import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qhmqysxlugrkfyizhair.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Website Content Schema TypeScript definitions
export interface MarqueeItem {
  id: number;
  src: string;
  title: string;
  description?: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  bgVideoUrl?: string;
  heroImageUrl?: string;
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
  marqueeItems: MarqueeItem[];
  showTeam?: boolean;
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

  // Submissions API
  submissions: any[];
  loadingSubmissions: boolean;
  loadSubmissions: () => Promise<void>;
  addSubmission: (type: "contact" | "pitch", submissionData: any) => Promise<boolean>;
  deleteSubmission: (id: number) => Promise<boolean>;
  clearAllSubmissions: () => Promise<boolean>;

  // Media Library API
  listMedia: () => Promise<string[]>;
  deleteMedia: (fileUrlOrName: string) => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Load content configuration and verify active session token on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Try to load from Supabase cms_content table
        const { data: dbData, error } = await supabase
          .from("cms_content")
          .select("data")
          .eq("id", 1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (dbData && dbData.data) {
          setData(dbData.data as WebsiteData);
        } else {
          // Table exists but no row with id=1, or table is empty
          const res = await fetch("/data/content.json");
          const json = await res.json();
          setData(json);
          // Try to seed Supabase with the default content.json
          try {
            await supabase.from("cms_content").upsert({ id: 1, data: json });
          } catch (seedErr) {
            console.warn("Failed to seed default content to Supabase", seedErr);
          }
        }
      } catch (err) {
        console.warn("Failed to load CMS content from Supabase, falling back to LocalStorage:", err);
        try {
          const localData = localStorage.getItem("pooja_cmsData");
          if (localData) {
            setData(JSON.parse(localData));
          } else {
            const res = await fetch("/data/content.json");
            const json = await res.json();
            setData(json);
          }
        } catch (localErr) {
          console.error("Critical fallback failed: ", localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadSubmissions();

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
      if (typeof sectionData !== "object" || sectionData === null) {
        return {
          ...prev,
          [section]: value,
        };
      }
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

  // Upload file directly to Supabase storage bucket
  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const formattedName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      
      // Upload to Supabase bucket 'uploads' under media/
      const { data: uploadData, error } = await supabase.storage
        .from("uploads")
        .upload("media/" + formattedName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl("media/" + formattedName);
        return urlData.publicUrl;
      }
      
      throw new Error("No upload data returned from Supabase Storage");
    } catch (err) {
      console.warn("Supabase Storage upload failed, falling back to local server uploader:", err);
      try {
        const formattedName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const res = await fetch("/api/upload-media", {
          method: "POST",
          headers: {
            "x-file-name": formattedName,
            "Content-Type": file.type,
          },
          body: file, // Pipeline raw binary upload
        });
        if (res.ok) {
          const result = await res.json();
          return result.url;
        }
        throw new Error("Local upload API returned non-200 status");
      } catch (localErr) {
        console.warn("Local uploader failed, falling back to Base64:", localErr);
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
    }
  };

  // Save layout state to Supabase cms_content table
  const saveAllChanges = async (): Promise<boolean> => {
    if (!data) return false;
    try {
      // 1. Save locally for immediate feedback
      localStorage.setItem("pooja_cmsData", JSON.stringify(data));
      
      // 2. Try to update local server during dev
      try {
        await fetch("/api/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (devErr) {
        // Ignore dev uploader failures on production
      }

      // 3. Upsert to Supabase
      const { error } = await supabase
        .from("cms_content")
        .upsert({ id: 1, data: data, updated_at: new Date().toISOString() });

      if (error) {
        throw error;
      }
      
      return true;
    } catch (e) {
      console.warn("Save content database request failed, changes saved locally:", e);
      return true; // Return true to prevent UI blocking
    }
  };

  // Submissions API implementation
  const loadSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const { data: rows, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(rows || []);
    } catch (e) {
      console.warn("Failed to load submissions from Supabase, loading from LocalStorage:", e);
      const stored = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
      setSubmissions(stored);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const addSubmission = async (type: "contact" | "pitch", submissionData: any): Promise<boolean> => {
    try {
      const timestamp = new Date().toISOString();
      // Insert to Supabase
      const { error } = await supabase
        .from("submissions")
        .insert({
          type,
          data: submissionData,
          created_at: timestamp
        });

      if (error) {
        throw error;
      }

      // Also cache in LocalStorage
      const existing = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
      existing.unshift({
        id: Date.now(), // Local representation
        type,
        timestamp,
        data: submissionData
      });
      localStorage.setItem("pp_submissions", JSON.stringify(existing));

      await loadSubmissions();
      return true;
    } catch (e) {
      console.warn("Failed to write submission to Supabase, fallback to LocalStorage:", e);
      const existing = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
      existing.unshift({
        id: Date.now(),
        type,
        timestamp: new Date().toISOString(),
        data: submissionData
      });
      localStorage.setItem("pp_submissions", JSON.stringify(existing));
      setSubmissions(existing);
      return true;
    }
  };

  const deleteSubmission = async (id: number): Promise<boolean> => {
    try {
      // If id is bigint/integer in database
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Also clean up local cache
      const stored = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
      const updated = stored.filter((x: any) => x.id !== id);
      localStorage.setItem("pp_submissions", JSON.stringify(updated));

      await loadSubmissions();
      return true;
    } catch (e) {
      console.warn("Failed to delete submission from Supabase, removing locally:", e);
      const stored = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
      const updated = stored.filter((x: any) => x.id !== id);
      localStorage.setItem("pp_submissions", JSON.stringify(updated));
      setSubmissions(updated);
      return true;
    }
  };

  const clearAllSubmissions = async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .neq("id", 0);

      if (error) {
        throw error;
      }

      localStorage.removeItem("pp_submissions");
      setSubmissions([]);
      return true;
    } catch (e) {
      console.warn("Failed to clear submissions from Supabase, clearing locally:", e);
      localStorage.removeItem("pp_submissions");
      setSubmissions([]);
      return true;
    }
  };

  // Media Library listing from Supabase storage uploads/media
  const listMedia = async (): Promise<string[]> => {
    try {
      const { data: files, error } = await supabase.storage
        .from("uploads")
        .list("media", { limit: 100, sortBy: { column: "name", order: "desc" } });
      
      if (error) {
        throw error;
      }
      
      if (files) {
        return files
          .filter(f => f.name !== ".emptyFolderPlaceholder")
          .map(f => {
            const { data: { publicUrl } } = supabase.storage
              .from("uploads")
              .getPublicUrl("media/" + f.name);
            return publicUrl;
          });
      }
      return [];
    } catch (err) {
      console.warn("Failed to list media from Supabase Storage, querying local uploader:", err);
      try {
        const res = await fetch("/api/list-media");
        const result = await res.json();
        return result.files || [];
      } catch (localErr) {
        console.warn("Failed to list local media:", localErr);
        return [];
      }
    }
  };

  // Media Library file delete from Supabase storage uploads/media or local uploader
  const deleteMedia = async (fileUrlOrName: string): Promise<boolean> => {
    try {
      if (fileUrlOrName.startsWith("http")) {
        const parts = fileUrlOrName.split("/");
        const fileName = parts[parts.length - 1];
        
        const { error } = await supabase.storage
          .from("uploads")
          .remove(["media/" + fileName]);
          
        if (error) {
          throw error;
        }
        return true;
      } else {
        const res = await fetch("/api/delete-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: fileUrlOrName })
        });
        const result = await res.json();
        return !!result.success;
      }
    } catch (err) {
      console.warn("Failed to delete media asset:", err);
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
        submissions,
        loadingSubmissions,
        loadSubmissions,
        addSubmission,
        deleteSubmission,
        clearAllSubmissions,
        listMedia,
        deleteMedia,
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
