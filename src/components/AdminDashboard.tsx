import React, { useState, useEffect, useRef } from "react";
import { useCMS } from "./CMSContext";
import type { FilmItem, TestimonialItem, AwardItem, TeamItem } from "./CMSContext";

export const AdminDashboard: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const cms = useCMS();
  const [activeTab, setActiveTab] = useState<"general" | "films" | "services" | "media" | "testimonials" | "awards" | "team">("general");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Adding New Items
  const [newFilm, setNewFilm] = useState<Omit<FilmItem, "id">>({ title: "", category: "", description: "", src: "" });
  const [newTestimonial, setNewTestimonial] = useState<Omit<TestimonialItem, "id">>({ name: "", position: "", description: "", rating: 5, avatar: "", imageUrl: "" });
  const [newAward, setNewAward] = useState<Omit<AwardItem, "id">>({ date: "", title: "", source: "", sourceUrl: "", description: "" });
  const [newTeam, setNewTeam] = useState<Omit<TeamItem, "id">>({ name: "", role: "", photo: "", bio: "" });

  const loadMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/list-media");
      const result = await res.json();
      setMediaFiles(result.files || []);
    } catch (e) {
      console.error("Failed to load stored media files", e);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "media") {
      loadMedia();
    }
  }, [activeTab]);

  if (!cms.data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#000", color: "#C5A880", fontFamily: '"Urbanist", sans-serif', fontSize: "1.8rem" }}>
        Loading control console data...
      </div>
    );
  }

  const { data, updateField, addListItem, updateListItem, deleteListItem, uploadMedia, saveAllChanges, logout } = cms;

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

  const handleDeleteMedia = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    try {
      const res = await fetch("/api/delete-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName })
      });
      const result = await res.json();
      if (result.success) {
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
            { id: "media", label: "Media Library", icon: "ph-image" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
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
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Background Video URL</label>
                  <input
                    type="text"
                    value={data.hero.bgVideoUrl}
                    onChange={(e) => updateField("hero", "bgVideoUrl", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase" }}>Hero Frame Image URL</label>
                  <input
                    type="text"
                    value={data.hero.heroImageUrl}
                    onChange={(e) => updateField("hero", "heroImageUrl", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
                </div>
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
                  <input
                    type="text"
                    value={data.about.brochureUrl}
                    onChange={(e) => updateField("about", "brochureUrl", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
                  />
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
                  <input
                    type="text"
                    value={data.about.address}
                    onChange={(e) => updateField("about", "address", e.target.value)}
                    style={{ padding: "1.2rem", backgroundColor: "#0C0C0C", border: "1px solid #262626", borderRadius: "0.8rem", color: "#FFF" }}
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
            </div>
          )}

          {/* TAB 2: FILMS SHOWCASE */}
          {activeTab === "films" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>FILMS SHOWCASE</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage movies listed on the website grid.</p>
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
                      <input
                        type="text"
                        value={film.src}
                        onChange={(e) => updateListItem("films", film.id, { src: e.target.value })}
                        placeholder="Poster Image URL (e.g. /uploads/film1.png)"
                        style={{ padding: "0.8rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.5rem", color: "#FFF" }}
                      />
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
                    <input
                      type="text"
                      value={newFilm.src}
                      onChange={(e) => setNewFilm({ ...newFilm, src: e.target.value })}
                      placeholder="/uploads/my_movie.webp"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
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
                        <input
                          type="text"
                          value={service.imgS}
                          onChange={(e) => updateListItem("services", service.id, { imgS: e.target.value })}
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <label>Portrait Image (imgM)</label>
                        <input
                          type="text"
                          value={service.imgM}
                          onChange={(e) => updateListItem("services", service.id, { imgM: e.target.value })}
                          style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                        />
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
                      <input
                        type="text"
                        value={test.imageUrl}
                        onChange={(e) => updateListItem("testimonials", test.id, { imageUrl: e.target.value })}
                        placeholder="Visual Photo Path"
                        style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", gridColumn: "1 / -1" }}>
                    <label>Testimonial Image URL</label>
                    <input
                      type="text"
                      value={newTestimonial.imageUrl}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, imageUrl: e.target.value })}
                      placeholder="/uploads/still.webp"
                      style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                    />
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
                    addListItem("testimonials", { ...newTestimonial, rating: 5, avatar: "img/avatars/400x400_t01.webp" });
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
              <div style={{ borderBottom: "1px solid #262626", paddingBottom: "2rem" }}>
                <h2 style={{ color: "#FFF", fontSize: "2.4rem", fontWeight: 700, margin: 0 }}>CREATIVE TEAM</h2>
                <p style={{ color: "#C5A880", margin: "0.5rem 0 0 0" }}>Manage members of Pooja Productions.</p>
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
                      <input
                        type="text"
                        value={member.photo}
                        onChange={(e) => updateListItem("team", member.id, { photo: e.target.value })}
                        placeholder="Photo URL path"
                        style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF" }}
                      />
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
                  <input
                    type="text"
                    placeholder="Photo File Path"
                    value={newTeam.photo}
                    onChange={(e) => setNewTeam({ ...newTeam, photo: e.target.value })}
                    style={{ padding: "1rem", backgroundColor: "#121212", border: "1px solid #262626", borderRadius: "0.6rem", color: "#FFF", gridColumn: "1 / -1" }}
                  />
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

          {/* TAB 7: MEDIA LIBRARY */}
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
                      const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file);
                      const isVideo = /\.(mp4|webm|mov)$/i.test(file);
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
                              <img src={`/uploads/${file}`} alt={file} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : isVideo ? (
                              <i className="ph ph-video-camera" style={{ fontSize: "4rem", color: "#C5A880" }}></i>
                            ) : (
                              <i className="ph ph-file-text" style={{ fontSize: "4rem", color: "#AEB5C5" }}></i>
                            )}
                          </div>
                          <div style={{ fontSize: "1.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFF" }}>
                            {file}
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`/uploads/${file}`);
                                alert(`Copied "/uploads/${file}" to clipboard!`);
                              }}
                              style={{ flex: 1, padding: "0.6rem", backgroundColor: "#262626", color: "#FFF", border: "none", borderRadius: "0.4rem", cursor: "pointer", fontSize: "1.1rem" }}
                            >
                              Copy Path
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
