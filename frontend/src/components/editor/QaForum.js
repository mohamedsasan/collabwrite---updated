// src/components/editor/QaForum.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Bell,
  Plus,
  X,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  Users,
  ChevronDown,
  MessageCircle,
  Bookmark,
  Clock,
  Award,
  Eye,
  Send,
  Image,
  Link2,
  CheckCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import "./QaForum.css";

const API_BASE = "http://localhost:5000/api/qa";

// Helper functions
const getCurrentUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u;
  } catch (e) {
    return null;
  }
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarColor = (name) => {
  const colors = [
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    "linear-gradient(135deg, #a855f7 0%, #22c55e 100%)",
    "linear-gradient(135deg, #fb7185 0%, #f97316 100%)",
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

// ===== Enhanced Header Component =====
function Qaheader({ onAddQuestion }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [activeTab, setActiveTab] = useState("question");
  const currentUser = getCurrentUser();

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      await axios.post(`${API_BASE}/add-question`, {
        question: questionText.trim(),
        imageUrl: inputUrl.trim() || null,
        userId: currentUser ? currentUser._id : null,
      });
      onAddQuestion();
      setQuestionText("");
      setInputUrl("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    }
  };

  return (
    <>
      <header className="qa-header-ultra">
        <div className="header-container-ultra">
          <div className="header-content-ultra">
            {/* Logo */}
            <div className="logo-section-ultra">
              <div className="logo-icon-ultra">
                <MessageCircle />
              </div>
              <div className="logo-text-ultra">
                <span className="logo-main">QaForum</span>
                <span className="logo-sub">COMMUNITY</span>
              </div>
            </div>

            {/* Search */}
            

            {/* Actions */}
            <div className="actions-section-ultra">
             
              <button
                className="user-avatar-ultra"
                type="button"
                style={{
                  background: getAvatarColor(currentUser?.name || "User"),
                }}
              >
                {currentUser ? getInitials(currentUser.name) : "JD"}
                <span className="status-dot" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="ask-btn-ultra"
                type="button"
              >
                <Plus />
                <span>Ask Question</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div
          className="modal-backdrop-ultra"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-container-ultra"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header-ultra">
              <div className="modal-header-content-ultra">
                <div className="modal-icon-wrapper">
                  <MessageCircle />
                </div>
                <div>
                  <h2 className="modal-title-ultra">Share Your Question</h2>
                  <p className="modal-subtitle-ultra">
                    Describe your problem clearly to get better answers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-ultra"
                type="button"
              >
                <X />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="modal-tabs-ultra">
              <button
                className={`modal-tab-ultra ${
                  activeTab === "question" ? "active" : ""
                }`}
                onClick={() => setActiveTab("question")}
                type="button"
              >
                <MessageCircle />
                <span>Question</span>
              </button>
              <button
                className={`modal-tab-ultra ${
                  activeTab === "link" ? "active" : ""
                }`}
                onClick={() => setActiveTab("link")}
                type="button"
              >
                <Link2 />
                <span>Share Link</span>
              </button>
              <div
                className="tab-indicator-ultra"
                style={{ left: activeTab === "question" ? "0" : "50%" }}
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body-ultra">
              <div className="user-info-ultra">
                <div
                  className="posting-avatar-ultra"
                  style={{
                    background: getAvatarColor(currentUser?.name || "User"),
                  }}
                >
                  {currentUser ? getInitials(currentUser.name) : "JD"}
                </div>
                <div className="posting-details-ultra">
                  <span className="posting-name-ultra">
                    {currentUser?.name || "John Doe"}
                  </span>
                  
                </div>
              </div>

              <div className="textarea-wrapper-ultra">
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What would you like to know? Include enough detail so others can help..."
                  className="modal-textarea-ultra"
                  maxLength={500}
                />
                <div className="char-counter-ultra">
                  {questionText.length} / 500
                </div>
              </div>

              <div className="media-section-ultra">
                <label className="media-label-ultra">
                  <Image />
                  <span>Add context (optional)</span>
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={
                    activeTab === "link"
                      ? "Paste a reference link or resource URL..."
                      : "Paste an image URL with code, error screenshots, etc..."
                  }
                  className="media-input-ultra"
                />
                {inputUrl && (
                  <div className="preview-container-ultra">
                    <img
                      src={inputUrl}
                      alt="preview"
                      className="preview-image-ultra"
                    />
                    <button
                      className="remove-btn-ultra"
                      onClick={() => setInputUrl("")}
                      type="button"
                    >
                      <X />
                    </button>
                  </div>
                )}
              </div>

              <div className="tip-card-ultra">
                <Award className="tip-icon-ultra" />
                <div>
                  <h4>Tip: Show what you’ve tried</h4>
                  <p>
                    Mention your goal, what you expected, what actually
                    happened, and any error messages.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-ultra">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-btn-ultra"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                disabled={!questionText.trim()}
                className="submit-btn-ultra"
                type="button"
              >
                <Send />
                <span>Post Question</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== Post Component =====
function Post({ question, onQuestionDeleted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const currentUser = getCurrentUser();

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-answers/${question._id}`);
      setAnswers(res.data || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const handleAddAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter an answer");
      return;
    }
    try {
      await axios.post(`${API_BASE}/add-answer`, {
        questionId: question._id,
        answer: answer.trim(),
        userId: currentUser ? currentUser._id : null,
      });
      setAnswer("");
      setIsModalOpen(false);
      fetchAnswers();
    } catch (error) {
      console.error("Error adding answer:", error);
      alert("Failed to add answer");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      await axios.delete(`${API_BASE}/answer/${answerId}`);
      fetchAnswers();
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Delete this question and all its answers?")) return;
    try {
      await axios.delete(`${API_BASE}/question/${question._id}`);
      onQuestionDeleted();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  useEffect(() => {
    fetchAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // simple example tags (you can wire real tags from backend later)
  const sampleTags = ["React", "Help"];

  return (
    <>
      <article className="post-card-ultra">
        {/* Post Header */}
        <div className="post-header-ultra">
          <div className="post-user-ultra">
            <div
              className="post-avatar-main-ultra"
              style={{
                background: getAvatarColor(question.user?.name || "User"),
              }}
            >
              {getInitials(question.user?.name || "user2")}
              <div className="avatar-ring-ultra" />
            </div>
            <div className="post-user-info-ultra">
              <div className="user-name-row-ultra">
                <h4 className="user-name-ultra">
                  {question.user?.name || "user2"}
                </h4>
                <span className="user-badge-ultra">Pro</span>
              </div>
              <div className="post-meta-ultra">
                <Clock className="meta-icon-ultra" />
                <span>
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="separator">•</span>
                <Eye className="meta-icon-ultra" />
                <span>234 views</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteQuestion}
            className="delete-btn-ultra"
            type="button"
          >
            <Trash2 />
          </button>
        </div>

        {/* Post Body */}
        <div className="post-body-ultra">
          <h3 className="post-question-ultra">{question.question}</h3>
          <div className="post-tags-row-ultra">
            {sampleTags.map((t) => (
              <span key={t} className="post-tag-chip-ultra">
                {t}
              </span>
            ))}
          </div>
          {question.imageUrl && (
            <div className="post-image-wrapper-ultra">
              <img
                src={question.imageUrl}
                alt="context"
                className="post-image-ultra"
              />
            </div>
          )}
        </div>

        {/* Post Stats */}
        <div className="post-stats-ultra">
          <div className="stat-chip-ultra">
            <ThumbsUp />
            <span>12 upvotes</span>
          </div>
          <div className="stat-chip-ultra">
            <MessageCircle />
            <span>{answers.length} answers</span>
          </div>
          {answers.length > 0 && (
            <div className="stat-chip-ultra solved">
              <CheckCircle />
              <span>Answered</span>
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="post-actions-ultra">
          <div className="actions-left-ultra">
            <button
              className={`vote-btn-ultra ${upvoted ? "active" : ""}`}
              onClick={() => {
                setUpvoted(!upvoted);
                if (!upvoted && downvoted) setDownvoted(false);
              }}
              type="button"
            >
              <ThumbsUp />
              <span>Upvote</span>
            </button>
            <button
              className={`vote-btn-ultra ${downvoted ? "active" : ""}`}
              onClick={() => {
                setDownvoted(!downvoted);
                if (!downvoted && upvoted) setUpvoted(false);
              }}
              type="button"
            >
              <ThumbsDown />
            </button>
          </div>
          <div className="actions-right-ultra">
            <button
              onClick={() => setIsModalOpen(true)}
              className="answer-btn-ultra"
              type="button"
            >
              <MessageCircle />
              <span>Answer</span>
            </button>
            
          </div>
        </div>

        {/* Answers */}
        {answers.length > 0 && (
          <div className="answers-section-ultra">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="answers-toggle-ultra"
              type="button"
            >
              <span>
                {answers.length} Answer{answers.length !== 1 ? "s" : ""}
              </span>
              <ChevronDown className={showAnswers ? "rotated" : ""} />
            </button>
            {showAnswers && (
              <div className="answers-list-ultra">
                {answers.map((ans) => (
                  <div key={ans._id} className="answer-item-ultra">
                    <div className="answer-header-ultra">
                      <div className="answer-user-ultra">
                        <div
                          className="answer-avatar-ultra"
                          style={{
                            background: getAvatarColor(
                              ans.user?.name || "User"
                            ),
                          }}
                        >
                          {getInitials(ans.user?.name || "User")}
                        </div>
                        <div className="answer-user-info-ultra">
                          <h5>{ans.user?.name || "User"}</h5>
                          <span>
                            {new Date(ans.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnswer(ans._id)}
                        className="answer-delete-ultra"
                        type="button"
                      >
                        <Trash2 />
                      </button>
                    </div>
                    <p className="answer-text-ultra">{ans.answer}</p>
                    <div className="answer-actions-ultra">
                      <button
                        className="answer-vote-ultra"
                        type="button"
                      >
                        <ThumbsUp />
                        <span>8</span>
                      </button>
                      <button
                        className="answer-vote-ultra"
                        type="button"
                      >
                        <ThumbsDown />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </article>

      {/* Answer Modal */}
      {isModalOpen && (
        <div
          className="modal-backdrop-ultra"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="answer-modal-ultra"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="answer-modal-header-ultra">
              <div>
                <h3 className="answer-modal-title-ultra">
                  {question.question}
                </h3>
                <p className="answer-modal-subtitle-ultra">
                  Asked by <strong>{question.user?.name || "User"}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-ultra"
                type="button"
              >
                <X />
              </button>
            </div>
            <div className="answer-modal-body-ultra">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="answer-textarea-ultra"
              />
            </div>
            <div className="answer-modal-footer-ultra">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-btn-ultra"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnswer}
                disabled={!answer.trim()}
                className="submit-btn-ultra"
                type="button"
              >
                <Send />
                <span>Post Answer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== Feed Component =====
function Feed({ refreshKey, onQuestionDeleted }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [sortBy, setSortBy] = useState("newest");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/get-questions`);
      let data = res.data || [];

      // simple client-side sort placeholder (you can replace with backend filters)
      if (sortBy === "newest") {
        data = data.slice().sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortBy === "oldest") {
        data = data.slice().sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, sortBy]);

  const totalQuestions = questions.length;

  if (loading) {
    return (
      <div className="feed-wrapper-ultra">
        <div className="loading-container-ultra">
          <div className="spinner-ultra" />
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-wrapper-ultra">
      {/* Feed Toolbar */}
      <div className="feed-header-ultra">
        <div className="feed-title-group-ultra">
          <h2 className="feed-title-ultra">Community Questions</h2>
          <p className="feed-subtitle-ultra">
            {totalQuestions === 0
              ? "No questions yet — be the first to ask!"
              : `${totalQuestions} question${
                  totalQuestions !== 1 ? "s" : ""
                } in the feed`}
          </p>
        </div>
        <div className="feed-controls-ultra">
          <button
            type="button"
            className={`filter-pill-ultra ${
              activeFilter === "recent" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("recent")}
            // currently visual only, can wire to backend later
          >
            <span>
              <Clock />
              Recent
            </span>
          </button>
          <button
            type="button"
            className={`filter-pill-ultra ${
              activeFilter === "trending" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("trending")}
          >
            <span>
              <TrendingUp />
              Trending
            </span>
          </button>
          <button
            type="button"
            className={`filter-pill-ultra ${
              activeFilter === "unanswered" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("unanswered")}
          >
            <span>
              <AlertCircle />
              Unanswered
            </span>
          </button>

          <select
            className="sort-select-ultra"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="feed-ultra">
        {questions.length === 0 ? (
          <div className="empty-state-ultra">
            <MessageCircle className="empty-icon-ultra" />
            <h3>No questions yet</h3>
            <p>Be the first to ask a question and start the conversation.</p>
          </div>
        ) : (
          questions.map((q) => (
            <Post
              key={q._id}
              question={q}
              onQuestionDeleted={onQuestionDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ===== Main Component =====
function Qa() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="qa-app-ultra">
      <Qaheader onAddQuestion={handleRefresh} />
      <div className="qa-main-ultra">
        <main className="qa-content-ultra">
          <Feed refreshKey={refreshKey} onQuestionDeleted={handleRefresh} />
        </main>
      </div>
    </div>
  );
}

export default Qa;