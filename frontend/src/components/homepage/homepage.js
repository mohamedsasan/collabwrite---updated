import React, { useState, useEffect } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Navigate to editor with selected template
  const handleTemplateClick = (templateFile) => {
    navigate(`/editor?template=${encodeURIComponent(templateFile)}`);
  };

  // Templates with file names
  const templates = [
    { title: "Blank Document", image: "/homepage/Blank document.png", file: "blank.html" },
    { title: "Project Proposal", image: "/homepage/Resume.png", file: "proposal.html" },
    { title: "Resume", image: "/homepage/Project Proposal.png", file: "resume.html" },
    { title: "Cover Letter", image: "/homepage/Cover letter.png", file: "coverletter.html" },
    { title: "Student Report", image: "/homepage/Student report.png", file: "report.html" },
  ];

  const recents = [
    { title: "CV", image: "/homepage/CV.png" },
    { title: "JAAAI", image: "/homepage/Jaaai.png" },
    { title: "Assignment", image: "/homepage/Assignment.png" },
    { title: "Request Letter", image: "/homepage/Request Letter.png" },
    { title: "Browse New", image: "/homepage/Browse New.png" },
  ];

  // Preload images
  const totalImages = templates.length + recents.length + 1;

  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= totalImages) setImagesLoaded(true);
      return newCount;
    });
  };

  const handleImageError = (imagePath) => {
    console.warn(`Failed to load image: ${imagePath}`);
    handleImageLoad();
  };

  useEffect(() => {
    const allImagePaths = [
      "/logo.png",
      ...templates.map((t) => t.image),
      ...recents.map((r) => r.image),
    ];

    allImagePaths.forEach((path) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = () => handleImageError(path);
      img.src = path;
    });

    const fallbackTimer = setTimeout(() => {
      if (!imagesLoaded) {
        console.warn("Timeout loading images. Showing anyway.");
        setImagesLoaded(true);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="homepage-container">
      {/* LOADING */}
      {!imagesLoaded && (
        <div className="page-loader">
          <div className="spinner"></div>
          <p>Loading... ({loadedCount}/{totalImages})</p>
        </div>
      )}

      {/* MAIN PAGE */}
      <div
        style={{
          opacity: imagesLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          visibility: imagesLoaded ? "visible" : "hidden",
        }}
      >
        {/* HEADER */}
        <div className="header">
          <img
            className="logo"
            src="/logo.png"
            alt="Logo"
            onLoad={handleImageLoad}
            onError={() => handleImageError("/logo.png")}
          />
          <input type="text" className="search-bar" placeholder="Search" />
        </div>

        {/* CREATE NEW DOCUMENT */}
        <div className="template-container">
          <div className="section">
            <h2>Create New Document</h2>
            <div className="card-row">
              {templates.map((doc, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => handleTemplateClick(doc.file)}
                >
                  <img
                    src={doc.image}
                    alt={doc.title}
                    onLoad={handleImageLoad}
                    onError={() => handleImageError(doc.image)}
                  />
                  <p>{doc.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT DOCUMENTS */}
          <div className="section">
            <h2>Recent Documents</h2>
            <div className="card-row">
              {recents.map((doc, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => alert(`Open ${doc.title}`)}
                >
                  <img
                    src={doc.image}
                    alt={doc.title}
                    onLoad={handleImageLoad}
                    onError={() => handleImageError(doc.image)}
                  />
                  <p>{doc.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
