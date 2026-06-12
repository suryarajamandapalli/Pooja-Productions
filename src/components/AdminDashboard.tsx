import React, { useState, useEffect, useRef } from "react";
import { useCMS } from "./CMSContext";
import type { FilmItem, TestimonialItem, AwardItem, TeamItem } from "./CMSContext";

export const AdminDashboard: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const cms = useCMS();
  const [activeTab, setActiveTab] = useState<"general" | "films" | "services" | "media" | "testimonials" | "awards" | "team" | "tools" | "submissions">("general");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineUploadRef = useRef<HTMLInputElement>(null);
  const [inlineUploadCallback, setInlineUploadCallback] = useState<((url: string) => void) | null>(null);
  const [newTool, setNewTool] = useState<{ name: string; icon: string }>({ name: "", icon: "" });
  const [editToolIndex, setEditToolIndex] = useState<number | null>(null);
  const [editToolData, setEditToolData] = useState<{ name: string; icon: string }>({ name: "", icon: "" });

  const handleInlineUpload = (callback: (url: string) => void) => {
    setInlineUploadCallback(() => callback);
    inlineUploadRef.current?.click();
  };

  const handleInlineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inlineUploadCallback) return;
    try {
      const url = await uploadMedia(file);
      inlineUploadCallback(url);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      e.target.value = "";
      setInlineUploadCallback(null);
    }
  };

  // States for Adding New Items
  const [newFilm, setNewFilm] = useState<Omit<FilmItem, "id">>({ title: "", category: "", description: "", src: "" });
  const [newTestimonial, setNewTestimonial] = useState<Omit<TestimonialItem, "id">>({ name: "", position: "", description: "", rating: 5, avatar: "", imageUrl: "" });
  const [newAward, setNewAward] = useState<Omit<AwardItem, "id">>({ date: "", title: "", source: "", sourceUrl: "", description: "" });
  const [newTeam, setNewTeam] = useState<Omit<TeamItem, "id">>({ name: "", role: "", photo: "", bio: "" });

  const loadMedia = async () => {
    setMediaLoading(true);
    try {
      const files = await listMedia();
      setMediaFiles(files);
    } catch (e) {
      console.error("Failed to load stored media files", e);
    } finally {
      setMediaLoading(false);
    }
  };

  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === "media") {
      loadMedia();
    }
    if (activeTab === "submissions") {
      loadSubmissions();
    }
  }, [activeTab]);

  if (!cms.data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#000", color: "#C5A880", fontFamily: '"Urbanist", sans-serif', fontSize: "1.8rem" }}>
        Loading control console data...
      </div>
    );
  }

  const {
    data,
    updateField,
    addListItem,
    updateListItem,
    deleteListItem,
    uploadMedia,
    saveAllChanges,
    logout,
    submissions,
    loadSubmissions,
    deleteSubmission,
    clearAllSubmissions,
    listMedia,
    deleteMedia
  } = cms;

  const nav = data?.navigation || {
    home: "Home",
    about: "About",
    film: "film",
    studio: "Studio",
    divisions: "Divisions",
    legacy: "legacy",
    team: "Team",
    letsConnect: "Let's Connect",
    contact: "Contact",
  };

  const sectionOptions = [
    { value: "close", label: "Close Popup Only" },
    { value: "#home", label: `${nav.home} Section` },
    { value: "#about", label: `${nav.about} Section` },
    { value: "#portfolio", label: nav.film },
    { value: "#studio", label: `${nav.studio} Section` },
    { value: "#services", label: nav.divisions },
    { value: "#resume", label: nav.legacy },
    { value: "#team", label: `${nav.team} Section` },
    { value: "#lets-pitch", label: nav.letsConnect },
    { value: "#contact", label: nav.contact },
  ];

  const handleSave = async () => {
    setSaveStatus("saving");
    const success = await saveAllChanges();
    if (success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  // Drag and Drop Uploader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let files: FileList | null = null;
    if ("dataTransfer" in e) {
      e.preventDefault();
      files = e.dataTransfer.files;
    } else if (e.target.files) {
      files = e.target.files;
    }

    if (!files || files.length === 0) return;

    setSaveStatus("saving");
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadMedia(files[i]);
      }
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
      if (activeTab === "media") {
        loadMedia();
      }
    } catch (err) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleDeleteMedia = async (fileUrlOrName: string) => {
    if (!confirm(`Are you sure you want to delete this asset?`)) return;
    try {
      const success = await deleteMedia(fileUrlOrName);
      if (success) {
        loadMedia();
      }
    } catch (e) {
      console.error("Failed to delete asset file", e);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "#AEB5C5",
      fontFamily: '"Urbanist", sans-serif',
      fontSize: "1.5rem",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Premium Obsidian & Gold Header */}
      <header style={{
        padding: "2rem 4rem",
        borderBottom: "1px solid rgba(197, 168, 128, 0.2)",
        backgroundColor: "#060606",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src="/logo.png" alt="Pooja Productions" style={{ height: "4rem", width: "auto", objectFit: "contain", display: "block" }} />
          <div style={{ borderLeft: "1px solid rgba(197, 168, 128, 0.3)", paddingLeft: "2rem" }}>
            <h1 style={{ color: "#FFFFFF", fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "0.05em" }}>
              CMS STUDIO CONTROL
            </h1>
            <p style={{ color: "#C5A880", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>
              Production Management Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            onClick={onBackToSite}
            className="btn-line"
            style={{
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              backgroundColor: "transparent",
              color: "#FFFFFF",
              border: "1px solid #262626",
              cursor: "pointer",
              transition: "border-color 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "#C5A880"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "#262626"}
          >
            View Live Site
          </button>

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            style={{
              padding: "1rem 2.5rem",
              borderRadius: "0.5rem",
              backgroundColor: saveStatus === "success" ? "#10B981" : "#C5A880",
              color: "#000000",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            {saveStatus === "saving" ? "Publishing..." : saveStatus === "success" ? "Published!" : "Publish Changes"}
          </button>

          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "#EF4444",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Navigation Sidebar */}
        <aside style={{
          width: "26rem",
          backgroundColor: "#050505",
          borderRight: "1px solid rgba(197, 168, 128, 0.1)",
          padding: "3rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          {[
            { id: "general", label: "General Copy", icon: "ph-pencil-line" },
            { id: "films", label: "Films Showcase", icon: "ph-film-strip" },
            { id: "services", label: "Studio Divisions", icon: "ph-projector-screen" },
            { id: "testimonials", label: "Directors Quotes", icon: "ph-chat-circle-dots" },
            { id: "awards", label: "Awards & Legacy", icon: "ph-trophy" },
            { id: "team", label: "Creative Team", icon: "ph-users" },
            { id: "tools", label: "Production Standards", icon: "ph-wrench" },
            { id: "submissions", label: "Form Submissions", icon: "ph-envelope-open" },
            { id: "media", label: "Media Library", icon: "ph-image" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "general" | "films" | "services" | "testimonials" | "awards" | "team" | "tools" | "submissions" | "media")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                width: "100%",
                padding: "1.2rem 2rem",
                borderRadius: "0.8rem",
                border: "none",
                backgroundColor: activeTab === tab.id ? "rgba(197, 168, 128, 0.15)" : "transparent",
                color: activeTab === tab.id ? "#C5A880" : "#AEB5C5",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#AEB5C5";
                }
              }}
            >
              <i className={`ph ${tab.icon}`} style={{ fontSize: "1.8rem" }}></i>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Sub-forms Grid */}
        <main style={{ flex: 1, padding: "4rem", overflowY: "auto", maxHeight: "calc(100vh - 8.5rem)" }}>
          {/* TOAST FEEDBACK NOTIFICATIONS */}
          {saveStatus === "success" && (
            <div style={{ position: "fixed", bottom: "3rem", right: "3rem", padding: "1.5rem 2.5rem", backgroundColor: "#10B981", color: "#FFF", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)", zIndex: 10000 }}>
              Website database changes successfully synchronized!
            </div>
          )}
          {saveStatus === "error" && (
            <div style={{ position: "fixed", bottom: "3rem", right: "3rem", padding: "1.5rem 2.5rem", backgroundColor: "#EF4444", color: "#FFF", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)", zIndex: 10000 }}>
              Synchronization failed. Verify file permissions.
            </div>
          )}

          {/* TAB 1: GENERAL COPY */}
          {activeTab === "general" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              {/* WELCOME POPUP SECTION */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>WELCOME POPUP COPY</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Modify the text and buttons on the initial welcome popup.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Headline</label>
                  <input
                    type="text"
                    value={data.welcomePopup?.headline || ""}
                    onChange={(e) => updateField("welcomePopup", "headline", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Subheadline</label>
                  <input
                    type="text"
                    value={data.welcomePopup?.subheadline || ""}
                    onChange={(e) => updateField("welcomePopup", "subheadline", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Description</label>
                  <textarea
                    value={data.welcomePopup?.description || ""}
                    onChange={(e) => updateField("welcomePopup", "description", e.target.value)}
                    style={{ minHeight: "8rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Primary Button Text (Gold)</label>
                  <input
                    type="text"
                    value={data.welcomePopup?.primaryBtnText || ""}
                    onChange={(e) => updateField("welcomePopup", "primaryBtnText", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Primary Button Target Link</label>
                  <select
                    value={data.welcomePopup?.primaryBtnLink || "close"}
                    onChange={(e) => updateField("welcomePopup", "primaryBtnLink", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  >
                    {sectionOptions.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: "#0C0C0C", color: "#FFF" }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Secondary Button Text</label>
                  <input
                    type="text"
                    value={data.welcomePopup?.secondaryBtnText || ""}
                    onChange={(e) => updateField("welcomePopup", "secondaryBtnText", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Secondary Button Target Link</label>
                  <select
                    value={data.welcomePopup?.secondaryBtnLink || "close"}
                    onChange={(e) => updateField("welcomePopup", "secondaryBtnLink", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  >
                    {sectionOptions.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: "#0C0C0C", color: "#FFF" }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NAVIGATION MENU SECTION */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>NAVIGATION MENU COPY</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Modify the labels in the sticky navigation menu.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Home</label>
                  <input
                    type="text"
                    value={data.navigation?.home || ""}
                    onChange={(e) => updateField("navigation", "home", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>About</label>
                  <input
                    type="text"
                    value={data.navigation?.about || ""}
                    onChange={(e) => updateField("navigation", "about", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Film Showcase</label>
                  <input
                    type="text"
                    value={data.navigation?.film || ""}
                    onChange={(e) => updateField("navigation", "film", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Studio</label>
                  <input
                    type="text"
                    value={data.navigation?.studio || ""}
                    onChange={(e) => updateField("navigation", "studio", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Divisions</label>
                  <input
                    type="text"
                    value={data.navigation?.divisions || ""}
                    onChange={(e) => updateField("navigation", "divisions", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Legacy</label>
                  <input
                    type="text"
                    value={data.navigation?.legacy || ""}
                    onChange={(e) => updateField("navigation", "legacy", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Team</label>
                  <input
                    type="text"
                    value={data.navigation?.team || ""}
                    onChange={(e) => updateField("navigation", "team", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Let's Connect</label>
                  <input
                    type="text"
                    value={data.navigation?.letsConnect || ""}
                    onChange={(e) => updateField("navigation", "letsConnect", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Contact</label>
                  <input
                    type="text"
                    value={data.navigation?.contact || ""}
                    onChange={(e) => updateField("navigation", "contact", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
              </div>

              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>HERO SECTION COPY</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Modify main cinematic landing copy.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Headline</label>
                  <textarea
                    value={data.hero.headline}
                    onChange={(e) => updateField("hero", "headline", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Subheadline</label>
                  <textarea
                    value={data.hero.subheadline}
                    onChange={(e) => updateField("hero", "subheadline", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Primary Button CTA</label>
                  <input
                    type="text"
                    value={data.hero.primaryBtnText}
                    onChange={(e) => updateField("hero", "primaryBtnText", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Secondary Button CTA</label>
                  <input
                    type="text"
                    value={data.hero.secondaryBtnText}
                    onChange={(e) => updateField("hero", "secondaryBtnText", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                 <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Background Video URL (Link / Uploaded)</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      value={data.hero.bgVideoUrl || ""}
                      onChange={(e) => updateField("hero", "bgVideoUrl", e.target.value)}
                      placeholder="Insert link or upload video"
                      style={{ flex: 1, padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                    />
                    <button
                      onClick={() => handleInlineUpload((url) => updateField("hero", "bgVideoUrl", url))}
                      style={{ padding: "1.2rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                    >
                      🎥 Upload Video
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Hero Frame Image URL</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      value={data.hero.heroImageUrl}
                      onChange={(e) => updateField("hero", "heroImageUrl", e.target.value)}
                      style={{ flex: 1, padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                    />
                    <button
                      onClick={() => handleInlineUpload((url) => updateField("hero", "heroImageUrl", url))}
                      style={{ padding: "1.2rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                    >
                      📷 Upload
                    </button>
                  </div>
                </div>
              </div>

              {/* HERO MARQUEE ITEMS */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "4rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>HERO MARQUEE CARDS</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage slide items, card titles, descriptions and images.</p>
              </div>

              {/* LIST OF CURRENT MARQUEE ITEMS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
                {(data.marqueeItems || []).map((item) => (
                  <div key={item.id} style={{
                    display: "flex",
                    gap: "2.5rem",
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2rem"
                  }}>
                    {item.src && (
                      <img src={item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`} alt={item.title} style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "0.6rem" }} />
                    )}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "1.1rem", color: "#AEB5C5", textTransform: "uppercase" }}>Card Title / Text</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateListItem("marqueeItems", item.id, { title: e.target.value })}
                            placeholder="Title"
                            style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "1.1rem", color: "#AEB5C5", textTransform: "uppercase" }}>Card Description / Sub text</label>
                          <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => updateListItem("marqueeItems", item.id, { description: e.target.value })}
                            placeholder="Subtext description"
                            style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "1.1rem", color: "#AEB5C5", textTransform: "uppercase" }}>Image Path / URL (From Media Library)</label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <input
                            type="text"
                            value={item.src}
                            onChange={(e) => updateListItem("marqueeItems", item.id, { src: e.target.value })}
                            placeholder="Image URL (e.g. img/marquee/01.webp)"
                            style={{ flex: 1, padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                          />
                          <button
                            onClick={() => handleInlineUpload((url) => updateListItem("marqueeItems", item.id, { src: url }))}
                            style={{ padding: "0.8rem 1.2rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                          >
                            📷 Upload
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <button
                        onClick={() => deleteListItem("marqueeItems", item.id)}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FORM TO ADD NEW MARQUEE ITEM */}
              <div style={{
                padding: "3rem",
                backgroundColor: "#0A0A0A",
                border: "1px dashed #C5A880",
                borderRadius: "1.2rem",
                marginBottom: "4rem"
              }}>
                <h3 style={{ color: "#FFFFFF", margin: "0 0 2rem 0" }}>+ Add New Marquee Card</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Card Title / Text</label>
                    <input
                      type="text"
                      id="newMarqueeTitle"
                      placeholder="e.g. Cinema Magic"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Card Description / Sub text</label>
                    <input
                      type="text"
                      id="newMarqueeDescription"
                      placeholder="e.g. Capturing the golden age"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                    <label>Image Path (From Media Library or uploads/)</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        id="newMarqueeSrc"
                        placeholder="e.g. img/marquee/01.webp or /uploads/custom_image.png"
                        style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
                      <button
                        onClick={() => handleInlineUpload((url) => {
                          const srcEl = document.getElementById("newMarqueeSrc") as HTMLInputElement;
                          if (srcEl) srcEl.value = url;
                        })}
                        style={{ padding: "1rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                      >
                        📷 Upload
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const titleEl = document.getElementById("newMarqueeTitle") as HTMLInputElement;
                    const descEl = document.getElementById("newMarqueeDescription") as HTMLInputElement;
                    const srcEl = document.getElementById("newMarqueeSrc") as HTMLInputElement;
                    if (!titleEl || !titleEl.value) {
                      alert("Please enter a Card Title.");
                      return;
                    }
                    addListItem("marqueeItems", {
                      title: titleEl.value,
                      description: descEl ? descEl.value : "",
                      src: srcEl ? srcEl.value : ""
                    });
                    if (titleEl) titleEl.value = "";
                    if (descEl) descEl.value = "";
                    if (srcEl) srcEl.value = "";
                  }}
                  style={{ padding: "1.2rem 2.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Add Card to Marquee
                </button>
              </div>

              {/* STUDIO SECTION */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "4rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>STUDIO COPY</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Vision, craft and contact settings.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Vision Title</label>
                  <input
                    type="text"
                    value={data.about.title}
                    onChange={(e) => updateField("about", "title", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Brochure PDF File path</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      value={data.about.brochureUrl}
                      onChange={(e) => updateField("about", "brochureUrl", e.target.value)}
                      style={{ flex: 1, padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                    />
                    <button
                      onClick={() => handleInlineUpload((url) => updateField("about", "brochureUrl", url))}
                      style={{ padding: "1.2rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                    >
                      📎 Upload
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Main Vision Description</label>
                  <textarea
                    value={data.about.paragraph1}
                    onChange={(e) => updateField("about", "paragraph1", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Leadership Highlight Description</label>
                  <textarea
                    value={data.about.paragraph2}
                    onChange={(e) => updateField("about", "paragraph2", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                {/* CONTACT DETAILS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Phone Number</label>
                  <input
                    type="text"
                    value={data.about.phone}
                    onChange={(e) => updateField("about", "phone", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Email Address</label>
                  <input
                    type="text"
                    value={data.about.email}
                    onChange={(e) => updateField("about", "email", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Office Address</label>
                  <textarea
                    value={data.about.address}
                    onChange={(e) => updateField("about", "address", e.target.value)}
                    style={{ minHeight: "8rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Google Map Link</label>
                  <input
                    type="text"
                    value={data.about.mapUrl}
                    onChange={(e) => updateField("about", "mapUrl", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
              </div>

              {/* STUDIO NETWORK & SOCIALS */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "4rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>STUDIO NETWORK & SOCIALS</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Edit links for Vimeo, Instagram, YouTube, and LinkedIn.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Vimeo URL</label>
                  <input
                    type="text"
                    value={data.about.vimeo || ""}
                    onChange={(e) => updateField("about", "vimeo", e.target.value)}
                    placeholder="https://vimeo.com/username"
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Instagram URL</label>
                  <input
                    type="text"
                    value={data.about.instagram || ""}
                    onChange={(e) => updateField("about", "instagram", e.target.value)}
                    placeholder="https://instagram.com/username"
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>YouTube URL</label>
                  <input
                    type="text"
                    value={data.about.youtube || ""}
                    onChange={(e) => updateField("about", "youtube", e.target.value)}
                    placeholder="https://youtube.com/c/username"
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>LinkedIn URL</label>
                  <input
                    type="text"
                    value={data.about.linkedin || ""}
                    onChange={(e) => updateField("about", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/username"
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
              </div>

              {/* LEADERSHIP & VISION DETAILS */}
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", marginTop: "4rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>LEADERSHIP & VISION DETAILS</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Edit Chairman & Producer information, quote, and bio.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Name</label>
                  <input
                    type="text"
                    value={data.leadership?.name || ""}
                    onChange={(e) => updateField("leadership", "name", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Role / Designation</label>
                  <input
                    type="text"
                    value={data.leadership?.role || ""}
                    onChange={(e) => updateField("leadership", "role", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Chairman Photo</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      value={data.leadership?.imageUrl || ""}
                      onChange={(e) => updateField("leadership", "imageUrl", e.target.value)}
                      style={{ flex: 1, padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                    />
                    <button
                      onClick={() => handleInlineUpload((url) => updateField("leadership", "imageUrl", url))}
                      style={{ padding: "1.2rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                    >
                      📷 Upload
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Chairman Quote</label>
                  <textarea
                    value={data.leadership?.quote || ""}
                    onChange={(e) => updateField("leadership", "quote", e.target.value)}
                    style={{ minHeight: "8rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Bio Paragraph 1</label>
                  <textarea
                    value={data.leadership?.bio1 || ""}
                    onChange={(e) => updateField("leadership", "bio1", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Bio Paragraph 2</label>
                  <textarea
                    value={data.leadership?.bio2 || ""}
                    onChange={(e) => updateField("leadership", "bio2", e.target.value)}
                    style={{ minHeight: "10rem", padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FILMS SHOWCASE */}
          {activeTab === "films" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>FILMS SHOWCASE</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage movies listed on the website grid.</p>
                <div style={{ marginTop: "1.2rem", backgroundColor: "rgba(197, 168, 128, 0.08)", border: "1px dashed rgba(197, 168, 128, 0.25)", padding: "1.2rem 1.8rem", borderRadius: "0.8rem", color: "#C5A880", fontSize: "1.3rem", lineHeight: 1.5 }}>
                  💡 <strong>Direct Inline Editing:</strong> You can edit any title, category, image path, or description directly inside the input boxes below. When finished, click the <strong>Publish Changes</strong> button at the top of the dashboard to save your updates to the live website.
                </div>
              </div>

              {/* LIST OF CURRENT FILMS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {data.films.map((film) => (
                  <div key={film.id} style={{
                    display: "flex",
                    gap: "2.5rem",
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2rem"
                  }}>
                    <img src={film.src.startsWith("http") || film.src.startsWith("/") ? film.src : `/${film.src}`} alt={film.title} style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "0.6rem" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <input
                          type="text"
                          value={film.title}
                          onChange={(e) => updateListItem("films", film.id, { title: e.target.value })}
                          placeholder="Title"
                          style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                        />
                        <input
                          type="text"
                          value={film.category}
                          onChange={(e) => updateListItem("films", film.id, { category: e.target.value })}
                          placeholder="Category (e.g. Feature Film | Sci-Fi)"
                          style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <input
                          type="text"
                          value={film.src}
                          onChange={(e) => updateListItem("films", film.id, { src: e.target.value })}
                          placeholder="Poster Image URL (e.g. /uploads/film1.png)"
                          style={{ flex: 1, padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                        />
                        <button
                          onClick={() => handleInlineUpload((url) => updateListItem("films", film.id, { src: url }))}
                          style={{ padding: "0.8rem 1.2rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 700, fontSize: "1.3rem", whiteSpace: "nowrap" }}
                        >
                          📁 Upload
                        </button>
                      </div>
                      <textarea
                        value={film.description}
                        onChange={(e) => updateListItem("films", film.id, { description: e.target.value })}
                        placeholder="Description"
                        style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF", minHeight: "6rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <button
                        onClick={() => deleteListItem("films", film.id)}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FORM TO ADD NEW FILM */}
              <div style={{
                marginTop: "4rem",
                padding: "3rem",
                backgroundColor: "#0A0A0A",
                border: "1px dashed #C5A880",
                borderRadius: "1.2rem"
              }}>
                <h3 style={{ color: "#FFFFFF", margin: "0 0 2rem 0" }}>+ Add New Production</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Film Title</label>
                    <input
                      type="text"
                      value={newFilm.title}
                      onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Category</label>
                    <input
                      type="text"
                      value={newFilm.category}
                      onChange={(e) => setNewFilm({ ...newFilm, category: e.target.value })}
                      placeholder="Feature Film | Sci-Fi"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                    <label>Poster Image Path (From Media Library)</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        value={newFilm.src}
                        onChange={(e) => setNewFilm({ ...newFilm, src: e.target.value })}
                        placeholder="/uploads/my_movie.webp"
                        style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
                      <button
                        onClick={() => handleInlineUpload((url) => setNewFilm((f) => ({ ...f, src: url })))}
                        style={{ padding: "1rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                      >
                        📁 Upload
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                    <label>Description</label>
                    <textarea
                      value={newFilm.description}
                      onChange={(e) => setNewFilm({ ...newFilm, description: e.target.value })}
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "8rem" }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!newFilm.title) return;
                    addListItem("films", newFilm);
                    setNewFilm({ title: "", category: "", description: "", src: "" });
                  }}
                  style={{ padding: "1.2rem 2.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Add Film to Slate
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES / DIVISIONS */}
          {activeTab === "services" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>STUDIO DIVISIONS (SERVICES)</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Edit details for the 4 core columns.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                {data.services.map((service) => (
                  <div key={service.id} style={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem"
                  }}>
                    <h4 style={{ color: "#C5A880", margin: 0, fontSize: "1.8rem" }}>Division #{service.id}</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <label>Division Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateListItem("services", service.id, { title: e.target.value })}
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <label>Phosphor Icon Class</label>
                        <input
                          type="text"
                          value={service.iconClass}
                          onChange={(e) => updateListItem("services", service.id, { iconClass: e.target.value })}
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <label>Landscape Image (imgS)</label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <input
                            type="text"
                            value={service.imgS}
                            onChange={(e) => updateListItem("services", service.id, { imgS: e.target.value })}
                            style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                          />
                          <button
                            onClick={() => handleInlineUpload((url) => updateListItem("services", service.id, { imgS: url }))}
                            style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                          >
                            📷 Upload
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <label>Portrait Image (imgM)</label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <input
                            type="text"
                            value={service.imgM}
                            onChange={(e) => updateListItem("services", service.id, { imgM: e.target.value })}
                            style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                          />
                          <button
                            onClick={() => handleInlineUpload((url) => updateListItem("services", service.id, { imgM: url }))}
                            style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                          >
                            📷 Upload
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                        <label>Description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateListItem("services", service.id, { description: e.target.value })}
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "7rem" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DIRECTORS TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>DIRECTORS QUOTES (TESTIMONIALS)</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage slide reviews.</p>
              </div>

              {/* CURRENT TESTIMONIALS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {data.testimonials.map((test) => (
                  <div key={test.id} style={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2.5rem",
                    display: "flex",
                    gap: "2.5rem"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => updateListItem("testimonials", test.id, { name: e.target.value })}
                          placeholder="Name"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                        <input
                          type="text"
                          value={test.position}
                          onChange={(e) => updateListItem("testimonials", test.id, { position: e.target.value })}
                          placeholder="Affiliation"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "1.2rem", color: "#C5A880" }}>Author Avatar Image</label>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <input
                              type="text"
                              value={test.avatar || ""}
                              onChange={(e) => updateListItem("testimonials", test.id, { avatar: e.target.value })}
                              placeholder="Avatar Path"
                              style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                            />
                            <button
                              onClick={() => handleInlineUpload((url) => updateListItem("testimonials", test.id, { avatar: url }))}
                              style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                            >
                              📷 Upload
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "1.2rem", color: "#C5A880" }}>Visual Photo Image</label>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <input
                              type="text"
                              value={test.imageUrl}
                              onChange={(e) => updateListItem("testimonials", test.id, { imageUrl: e.target.value })}
                              placeholder="Visual Photo Path"
                              style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                            />
                            <button
                              onClick={() => handleInlineUpload((url) => updateListItem("testimonials", test.id, { imageUrl: url }))}
                              style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                            >
                              📷 Upload
                            </button>
                          </div>
                        </div>
                      </div>

                      <textarea
                        value={test.description}
                        onChange={(e) => updateListItem("testimonials", test.id, { description: e.target.value })}
                        placeholder="Quote text..."
                        style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "8rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => deleteListItem("testimonials", test.id)}
                        style={{ padding: "1.2rem 2rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.6rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD NEW TESTIMONIAL FORM */}
              <div style={{
                marginTop: "4rem",
                padding: "3rem",
                backgroundColor: "#0A0A0A",
                border: "1px dashed #C5A880",
                borderRadius: "1.2rem"
              }}>
                <h3 style={{ color: "#FFFFFF", margin: "0 0 2rem 0" }}>+ Add Director Quote</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Director Name</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Affiliation / Position</label>
                    <input
                      type="text"
                      value={newTestimonial.position}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                      placeholder="e.g. Director & Collaborator at Syncopy"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Author Avatar Image</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        value={newTestimonial.avatar}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                        placeholder="/uploads/avatar.webp"
                        style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
                      <button
                        onClick={() => handleInlineUpload((url) => setNewTestimonial({ ...newTestimonial, avatar: url }))}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                      >
                        📷 Upload
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label>Visual Photo Image</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        value={newTestimonial.imageUrl}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, imageUrl: e.target.value })}
                        placeholder="/uploads/still.webp"
                        style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
                      <button
                        onClick={() => handleInlineUpload((url) => setNewTestimonial({ ...newTestimonial, imageUrl: url }))}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}
                      >
                        📷 Upload
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                    <label>Quote Content</label>
                    <textarea
                      value={newTestimonial.description}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, description: e.target.value })}
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "8rem" }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!newTestimonial.name) return;
                    addListItem("testimonials", { ...newTestimonial, rating: 5, avatar: newTestimonial.avatar || "img/avatars/400x400_t01.webp" });
                    setNewTestimonial({ name: "", position: "", description: "", rating: 5, avatar: "", imageUrl: "" });
                  }}
                  style={{ padding: "1.2rem 2.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Save Testimonial
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AWARDS & LEGACY */}
          {activeTab === "awards" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>AWARDS & ACCOLADES</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage festival recognitions.</p>
              </div>

              {/* CURRENT AWARDS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {data.awards.map((award) => (
                  <div key={award.id} style={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2rem",
                    display: "flex",
                    gap: "2rem"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "1.5rem" }}>
                        <input
                          type="text"
                          value={award.date}
                          onChange={(e) => updateListItem("awards", award.id, { date: e.target.value })}
                          placeholder="Year"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => updateListItem("awards", award.id, { title: e.target.value })}
                          placeholder="Award Title"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                        <input
                          type="text"
                          value={award.source}
                          onChange={(e) => updateListItem("awards", award.id, { source: e.target.value })}
                          placeholder="Festival / Source"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      <textarea
                        value={award.description}
                        onChange={(e) => updateListItem("awards", award.id, { description: e.target.value })}
                        placeholder="Details..."
                        style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "5rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => deleteListItem("awards", award.id)}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEW AWARD FORM */}
              <div style={{
                marginTop: "3rem",
                padding: "2.5rem",
                backgroundColor: "#0A0A0A",
                border: "1px dashed #C5A880",
                borderRadius: "1.2rem"
              }}>
                <h3 style={{ color: "#FFFFFF", margin: "0 0 2rem 0" }}>+ Add Award Recognition</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <input
                    type="text"
                    placeholder="Year (e.g. 2026)"
                    value={newAward.date}
                    onChange={(e) => setNewAward({ ...newAward, date: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                  />
                  <input
                    type="text"
                    placeholder="Award Title"
                    value={newAward.title}
                    onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                  />
                  <input
                    type="text"
                    placeholder="Festival (e.g. Cannes Film Festival)"
                    value={newAward.source}
                    onChange={(e) => setNewAward({ ...newAward, source: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                  />
                  <input
                    type="text"
                    placeholder="Festival URL link"
                    value={newAward.sourceUrl}
                    onChange={(e) => setNewAward({ ...newAward, sourceUrl: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", gridColumn: "1 / -1" }}
                  />
                  <textarea
                    placeholder="Award detail description..."
                    value={newAward.description}
                    onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", minHeight: "6rem", gridColumn: "1 / -1" }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newAward.title) return;
                    addListItem("awards", newAward);
                    setNewAward({ date: "", title: "", source: "", sourceUrl: "", description: "" });
                  }}
                  style={{ padding: "1.2rem 2.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Save Award
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: CREATIVE TEAM */}
          {activeTab === "team" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>CREATIVE TEAM</h2>
                  <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage members of Pooja Productions.</p>
                  <div style={{ marginTop: "1.2rem", backgroundColor: "rgba(197, 168, 128, 0.08)", border: "1px dashed rgba(197, 168, 128, 0.25)", padding: "1.2rem 1.8rem", borderRadius: "0.8rem", color: "#C5A880", fontSize: "1.3rem", lineHeight: 1.5 }}>
                    💡 <strong>Direct Inline Editing:</strong> You can edit any member name, role, photo path, or bio directly inside the input boxes below. When finished, click the <strong>Publish Changes</strong> button at the top of the dashboard to save your updates to the live website.
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", padding: "0.8rem 1.6rem", borderRadius: "2rem" }}>
                  <span style={{ color: data.showTeam !== false ? "#C5A880" : "#777", fontSize: "1.3rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Creative Team: {data.showTeam !== false ? "ENABLED" : "DISABLED"}
                  </span>
                  <button
                    onClick={() => updateField("showTeam" as any, "", !(data.showTeam !== false))}
                    style={{
                      width: "5rem",
                      height: "2.6rem",
                      borderRadius: "1.3rem",
                      backgroundColor: data.showTeam !== false ? "#C5A880" : "#262626",
                      position: "relative",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      padding: 0,
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <div style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      backgroundColor: data.showTeam !== false ? "#000" : "#FFF",
                      position: "absolute",
                      top: "0.3rem",
                      left: data.showTeam !== false ? "2.7rem" : "0.3rem",
                      transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease"
                    }} />
                  </button>
                </div>
              </div>

              {/* TEAM LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {data.team.map((member) => (
                  <div key={member.id} style={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #1E1E1E",
                    borderRadius: "1rem",
                    padding: "2rem",
                    display: "flex",
                    gap: "2.5rem"
                  }}>
                    <img src={member.photo.startsWith("http") || member.photo.startsWith("/") ? member.photo : `/${member.photo}`} alt={member.name} style={{ width: "90px", height: "120px", objectFit: "cover", borderRadius: "0.6rem" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateListItem("team", member.id, { name: e.target.value })}
                          placeholder="Name"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateListItem("team", member.id, { role: e.target.value })}
                          placeholder="Role (e.g. Chief Editor)"
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <input
                          type="text"
                          value={member.photo}
                          onChange={(e) => updateListItem("team", member.id, { photo: e.target.value })}
                          placeholder="Photo URL path"
                          style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                        <button
                          onClick={() => handleInlineUpload((url) => updateListItem("team", member.id, { photo: url }))}
                          style={{ padding: "1rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                        >
                          📁 Upload
                        </button>
                      </div>
                      <input
                        type="text"
                        value={member.bio}
                        onChange={(e) => updateListItem("team", member.id, { bio: e.target.value })}
                        placeholder="Brief bio line..."
                        style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => deleteListItem("team", member.id)}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEW TEAM MEMBER FORM */}
              <div style={{
                marginTop: "3rem",
                padding: "2.5rem",
                backgroundColor: "#0A0A0A",
                border: "1px dashed #C5A880",
                borderRadius: "1.2rem"
              }}>
                <h3 style={{ color: "#FFFFFF", margin: "0 0 2rem 0" }}>+ Add Creative Team Member</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Visual Director)"
                    value={newTeam.role}
                    onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                  />
                  <div style={{ display: "flex", gap: "1rem", gridColumn: "1 / -1" }}>
                    <input
                      type="text"
                      placeholder="Photo File Path"
                      value={newTeam.photo}
                      onChange={(e) => setNewTeam({ ...newTeam, photo: e.target.value })}
                      style={{ flex: 1, padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
                    <button
                      onClick={() => handleInlineUpload((url) => setNewTeam({ ...newTeam, photo: url }))}
                      style={{ padding: "1rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }}
                    >
                      📁 Upload
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Brief bio line..."
                    value={newTeam.bio}
                    onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", gridColumn: "1 / -1" }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newTeam.name) return;
                    addListItem("team", newTeam);
                    setNewTeam({ name: "", role: "", photo: "", bio: "" });
                  }}
                  style={{ padding: "1.2rem 2.5rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Save Member
                </button>
              </div>
            </div>
          )}

          {/* Hidden inline file input for all device-upload buttons */}
          <input
            type="file"
            accept="image/*,application/pdf,video/*"
            ref={inlineUploadRef}
            style={{ display: "none" }}
            onChange={handleInlineFileChange}
          />

          {/* TAB 7: PRODUCTION STANDARDS (TOOLS) */}
          {activeTab === "tools" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>OUR PRODUCTION STANDARDS</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage the technology tools & equipment cards shown on the site.</p>
              </div>

              {/* ADD NEW TOOL FORM */}
              <div style={{ backgroundColor: "#0A0A0A", border: "1px solid #262626", borderRadius: "1rem", padding: "2.5rem" }}>
                <h3 style={{ color: "#FFF", marginBottom: "2rem", fontSize: "1.8rem" }}>+ Add New Tool / Equipment</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Tool / Equipment Name</label>
                    <input
                      type="text"
                      placeholder="e.g. IMAX Cameras"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", fontSize: "1.5rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Icon Image URL or Upload</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        placeholder="/img/icons/imax.png or URL"
                        value={newTool.icon}
                        onChange={(e) => setNewTool({ ...newTool, icon: e.target.value })}
                        style={{ flex: 1, padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF", fontSize: "1.5rem" }}
                      />
                      <button
                        onClick={() => handleInlineUpload((url) => setNewTool((t) => ({ ...t, icon: url })))}
                        style={{ padding: "1.2rem 1.8rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap", fontSize: "1.4rem" }}
                      >
                        📁 Upload
                      </button>
                    </div>
                    {newTool.icon && (
                      <img src={newTool.icon.startsWith("http") || newTool.icon.startsWith("/") ? newTool.icon : `/${newTool.icon}`} alt="preview" style={{ width: "6rem", height: "6rem", objectFit: "contain", borderRadius: "0.8rem", border: "1px solid #262626", backgroundColor: "#1a1a1a", padding: "0.5rem" }} />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!newTool.name) return alert("Please enter a tool name.");
                    const currentTools: any[] = (data.tools || []) as any[];
                    const updated = [...currentTools, { name: newTool.name, icon: newTool.icon }];
                    updateField("tools" as any, "__array__", updated);
                    // Use addListItem workaround — tools don't have ids so use direct state update
                    cms.addListItem("tools" as any, { name: newTool.name, icon: newTool.icon, id: Date.now() });
                    setNewTool({ name: "", icon: "" });
                  }}
                  style={{ padding: "1.2rem 3rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 700, fontSize: "1.5rem" }}
                >
                  Add Tool
                </button>
              </div>

              {/* CURRENT TOOLS LIST */}
              <div>
                <h3 style={{ color: "#FFF", marginBottom: "2rem", fontSize: "1.8rem" }}>Current Tools ({(data.tools || []).length})</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
                  {(data.tools || []).map((tool, idx) => (
                    <div key={idx} style={{ backgroundColor: "#0A0A0A", border: "1px solid #262626", borderRadius: "1rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {editToolIndex === idx ? (
                        // EDIT MODE
                        <>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            <label style={{ fontSize: "1.2rem", color: "#AEB5C5" }}>Name</label>
                            <input
                              type="text"
                              value={editToolData.name}
                              onChange={(e) => setEditToolData({ ...editToolData, name: e.target.value })}
                              style={{ padding: "0.8rem", backgroundColor: "#0C0C0C", border: "1px solid #C5A880", borderRadius: "0.5rem", color: "#FFF", fontSize: "1.4rem" }}
                            />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            <label style={{ fontSize: "1.2rem", color: "#AEB5C5" }}>Icon</label>
                            <div style={{ display: "flex", gap: "0.8rem" }}>
                              <input
                                type="text"
                                value={editToolData.icon}
                                onChange={(e) => setEditToolData({ ...editToolData, icon: e.target.value })}
                                style={{ flex: 1, padding: "0.8rem", backgroundColor: "#0C0C0C", border: "1px solid #C5A880", borderRadius: "0.5rem", color: "#FFF", fontSize: "1.3rem" }}
                              />
                              <button
                                onClick={() => handleInlineUpload((url) => setEditToolData((d) => ({ ...d, icon: url })))}
                                style={{ padding: "0.8rem 1.2rem", backgroundColor: "#C5A880", color: "#000", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "1.3rem" }}
                              >
                                📁
                              </button>
                            </div>
                            {editToolData.icon && (
                              <img src={editToolData.icon.startsWith("http") || editToolData.icon.startsWith("/") ? editToolData.icon : `/${editToolData.icon}`} alt="preview" style={{ width: "5rem", height: "5rem", objectFit: "contain", borderRadius: "0.5rem", border: "1px solid #262626", backgroundColor: "#1a1a1a", padding: "0.4rem" }} />
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                              onClick={() => {
                                const currentTools = [...(data.tools || [])];
                                currentTools[idx] = { name: editToolData.name, icon: editToolData.icon };
                                // Update via deleteListItem + addListItem workaround for index-based tools
                                // We update the whole array by rebuilding data.tools
                                for (let i = currentTools.length - 1; i >= 0; i--) {
                                  if ((currentTools[i] as any).id !== undefined) delete (currentTools[i] as any).id;
                                }
                                // Use a direct approach: update each tool that has a matching index
                                setEditToolIndex(null);
                                alert("Tool updated! Click 'Publish Changes' to save.");
                                // Rebuild tools array in data
                                const updatedTools = (data.tools || []).map((t, i) => i === idx ? { name: editToolData.name, icon: editToolData.icon } : t);
                                updateField("tools" as any, "__replace__", updatedTools);
                              }}
                              style={{ flex: 1, padding: "0.8rem", backgroundColor: "#10B981", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 600 }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditToolIndex(null)}
                              style={{ padding: "0.8rem 1.5rem", backgroundColor: "#262626", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        // VIEW MODE
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            {tool.icon ? (
                              <img src={tool.icon.startsWith("http") || tool.icon.startsWith("/") ? tool.icon : `/${tool.icon}`} alt={tool.name} style={{ width: "5rem", height: "5rem", objectFit: "contain", borderRadius: "0.8rem", border: "1px solid #262626", backgroundColor: "#1a1a1a", padding: "0.5rem" }} />
                            ) : (
                              <div style={{ width: "5rem", height: "5rem", backgroundColor: "#1a1a1a", borderRadius: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="ph ph-wrench" style={{ fontSize: "2rem", color: "#C5A880" }}></i>
                              </div>
                            )}
                            <span style={{ color: "#FFF", fontWeight: 600, fontSize: "1.6rem" }}>{tool.name}</span>
                          </div>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                              onClick={() => { setEditToolIndex(idx); setEditToolData({ name: tool.name, icon: tool.icon }); }}
                              style={{ flex: 1, padding: "0.8rem", backgroundColor: "#262626", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => {
                                if (!confirm(`Remove "${tool.name}"?`)) return;
                                const updatedTools = (data.tools || []).filter((_, i) => i !== idx);
                                updateField("tools" as any, "__replace__", updatedTools);
                              }}
                              style={{ padding: "0.8rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                            >
                              <i className="ph ph-trash"></i>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FORM SUBMISSIONS */}
          {activeTab === "submissions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>FORM SUBMISSIONS</h2>
                  <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>All contact and pitch form entries submitted through the website.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={loadSubmissions} style={{ padding: "1rem 2rem", backgroundColor: "#262626", color: "#FFF", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
                    <i className="ph ph-arrows-clockwise"></i> Refresh
                  </button>
                   {submissions.length > 0 && (
                    <button
                      onClick={async () => { if (confirm("Clear ALL submissions? This cannot be undone.")) { await clearAllSubmissions(); } }}
                      style={{ padding: "1rem 2rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.8rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {submissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(255,255,255,0.3)" }}>
                  <i className="ph ph-envelope-simple" style={{ fontSize: "5rem", display: "block", marginBottom: "1.5rem" }}></i>
                  <p style={{ fontSize: "1.8rem" }}>No submissions yet.</p>
                  <p style={{ fontSize: "1.4rem", marginTop: "0.5rem" }}>Form entries will appear here once visitors submit the contact or pitch forms.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {submissions.map((sub, idx) => {
                    const isContact = sub.type === "contact";
                    const isExpanded = expandedSubmission === idx;
                    const d = sub.data;
                    const date = new Date(sub.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
                    return (
                      <div key={sub.id || idx} style={{ backgroundColor: "#0A0A0A", border: `1px solid ${isContact ? "rgba(197,168,128,0.3)" : "rgba(99,102,241,0.3)"}`, borderRadius: "1rem", overflow: "hidden" }}>
                        {/* Header row */}
                        <div
                          onClick={() => setExpandedSubmission(isExpanded ? null : idx)}
                          style={{ padding: "1.8rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: "1rem", flexWrap: "wrap" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <span style={{
                              padding: "0.4rem 1.2rem",
                              borderRadius: "100px",
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              backgroundColor: isContact ? "rgba(197,168,128,0.15)" : "rgba(99,102,241,0.15)",
                              color: isContact ? "#C5A880" : "#818CF8"
                            }}>
                              {isContact ? "📩 Contact" : "🎬 Pitch"}
                            </span>
                            <span style={{ color: "#FFF", fontWeight: 600, fontSize: "1.6rem" }}>
                              {isContact ? d.name : `${d.firstName} ${d.lastName}`}
                            </span>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.3rem" }}>
                              {isContact ? d.email : d.emailId}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.2rem" }}>{date}</span>
                            <i className={`ph ph-caret-${isExpanded ? "up" : "down"}`} style={{ color: "#C5A880", fontSize: "1.6rem" }}></i>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div style={{ padding: "0 2rem 2rem", borderTop: "1px solid #1a1a1a" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                              {Object.entries(d).map(([key, val]: [string, any]) => (
                                val !== false && val !== "" && val !== undefined ? (
                                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                    <label style={{ fontSize: "1.1rem", color: "#C5A880", textTransform: "uppercase", letterSpacing: "0.1em" }}>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                                    <p style={{ color: "#FFF", fontSize: "1.4rem", margin: 0, wordBreak: "break-word", lineHeight: 1.5 }}>{String(val)}</p>
                                  </div>
                                ) : null
                              ))}
                            </div>
                            <button
                              onClick={async () => {
                                if (confirm("Delete this submission?")) {
                                  await deleteSubmission(sub.id);
                                  setExpandedSubmission(null);
                                }
                              }}
                              style={{ marginTop: "2rem", padding: "0.8rem 2rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontSize: "1.3rem" }}
                            >
                              <i className="ph ph-trash"></i> Delete This Submission
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>MEDIA LIBRARY</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Drag-and-drop or select files to store on the server. Copy urls to insert into sections above.</p>
              </div>

              {/* DRAG AND DROP AREA */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed rgba(197, 168, 128, 0.4)",
                  backgroundColor: "rgba(197, 168, 128, 0.03)",
                  borderRadius: "1.5rem",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = "#C5A880"}
                onMouseOut={(e) => e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.4)"}
              >
                <i className="ph-light ph-cloud-arrow-up" style={{ fontSize: "5rem", color: "#C5A880", marginBottom: "1rem" }}></i>
                <p style={{ color: "#FFFFFF", fontWeight: 600, margin: 0 }}>Drag & Drop photos, videos, or PDFs here</p>
                <p style={{ color: "#505258", fontSize: "1.3rem", marginTop: "0.5rem" }}>Or click to choose files from disk</p>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>

              {/* MEDIA FILE LIST */}
              <div>
                <h3 style={{ color: "#FFF", marginBottom: "2rem" }}>Stored Assets ({mediaFiles.length})</h3>
                {mediaLoading ? (
                  <p>Scanning files...</p>
                ) : mediaFiles.length === 0 ? (
                  <p style={{ fontStyle: "italic" }}>No files uploaded yet.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "2rem" }}>
                    {mediaFiles.map((file) => {
                      const isSupabaseUrl = file.startsWith("http");
                      const displayUrl = isSupabaseUrl ? file : `/uploads/${file}`;
                      const displayTitle = isSupabaseUrl ? file.substring(file.lastIndexOf("/") + 1).replace(/^\d+_/, "") : file.replace(/^\d+_/, "");
                      const isImage = /\.(jpg|jpeg|png|webp|gif|svg)/i.test(displayUrl);
                      const isVideo = /\.(mp4|webm|mov)/i.test(displayUrl);
                      return (
                        <div key={file} style={{
                          backgroundColor: "#0A0A0A",
                          border: "1px solid #1E1E1E",
                          borderRadius: "1rem",
                          padding: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.2rem",
                          position: "relative"
                        }}>
                          <div style={{
                            width: "100%",
                            aspectRatio: "1/1",
                            backgroundColor: "#121212",
                            borderRadius: "0.6rem",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            {isImage ? (
                              <img src={displayUrl} alt={displayTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : isVideo ? (
                              <i className="ph ph-video-camera" style={{ fontSize: "4rem", color: "#C5A880" }}></i>
                            ) : (
                              <i className="ph ph-file-text" style={{ fontSize: "4rem", color: "#AEB5C5" }}></i>
                            )}
                          </div>
                          <div style={{ fontSize: "1.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFF" }} title={displayTitle}>
                            {displayTitle}
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(displayUrl);
                                alert(`Copied "${displayUrl}" to clipboard!`);
                              }}
                              style={{ flex: 1, padding: "0.6rem", backgroundColor: "#262626", color: "#FFF", border: "none", borderRadius: "0.4rem", cursor: "pointer", fontSize: "1.1rem" }}
                            >
                              Copy URL
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(file)}
                              style={{ padding: "0.6rem", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "0.4rem", cursor: "pointer" }}
                            >
                              <i className="ph ph-trash"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
