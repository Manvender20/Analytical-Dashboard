
import { useEffect, useState } from "react";
import {
  Activity,
  MousePointer2,
  Eye,
  Users,
  RefreshCw,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Flame,
  ArrowLeft,
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [clicks, setClicks] = useState([]);
  const [view, setView] = useState("sessions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json();
  }

  async function loadSessions() {
    setLoading(true);
    setError("");

    try {
      const result = await fetchJSON(`${API}/api/sessions`);
      setSessions(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openSession(session) {
    setSelectedSession(session);
    setEvents([]);
    setError("");

    try {
      const result = await fetchJSON(
        `${API}/api/sessions/${encodeURIComponent(session.session_id)}/events`
      );
      setEvents(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadPages() {
    try {
      const result = await fetchJSON(`${API}/api/heatmap/pages`);
      setPages(result.data);

      if (result.data.length > 0 && !selectedPage) {
        setSelectedPage(result.data[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadClicks(pageUrl) {
    if (!pageUrl) {
      setClicks([]);
      return;
    }

    try {
      const result = await fetchJSON(
        `${API}/api/heatmap/clicks?pageUrl=${encodeURIComponent(pageUrl)}`
      );
      setClicks(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadSessions();
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadClicks(selectedPage);
    }
  }, [selectedPage]);

  const totalEvents = sessions.reduce(
    (sum, session) => sum + session.totalEvents,
    0
  );

  const totalViews = sessions.reduce(
    (sum, session) => sum + session.pageViews,
    0
  );

  const totalClicks = sessions.reduce(
    (sum, session) => sum + session.clicks,
    0
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} />
          </div>
          <div>
            <h2>CausalFunnel</h2>
            <span>Analytics</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button
          className={`nav-item ${view === "sessions" ? "active" : ""}`}
          onClick={() => {
            setView("sessions");
            setSelectedSession(null);
          }}
        >
          <LayoutDashboard size={18} />
          Sessions
        </button>

        <button
          className={`nav-item ${view === "heatmap" ? "active" : ""}`}
          onClick={() => {
            setView("heatmap");
            setSelectedSession(null);
          }}
        >
          <Flame size={18} />
          Click heatmap
        </button>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Backend connected
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
             {view === "heatmap"
             ? "BEHAVIOR / CLICK ANALYSIS"
             : selectedSession
             ? "SESSIONS / EVENT DETAIL"
            : "WORKSPACE / SESSIONS"}
           </p>
            <h1>
              {view === "heatmap"
                ? "Click heatmap"
                : selectedSession
                  ? "User journey"
                  : "Sessions overview"}
            </h1>
          </div>

          <button
            className="refresh-button"
            onClick={() => {
              loadSessions();
              loadPages();
              if (selectedPage) loadClicks(selectedPage);
              if (selectedSession) openSession(selectedSession);
            }}
          >
            <RefreshCw size={16} />
            Refresh data
          </button>
        </header>

        {error && (
          <div className="error-banner">
            {error}. Check that your backend is running on port 5000.
          </div>
        )}

        {view === "sessions" && (
          <>
            <section className="stats-grid">
              <StatCard
                icon={Users}
                label="Total sessions"
                value={sessions.length}
              />
              <StatCard
                icon={Activity}
                label="Total events"
                value={totalEvents}
              />
              <StatCard
                icon={Eye}
                label="Page views"
                value={totalViews}
              />
              <StatCard
                icon={MousePointer2}
                label="Total clicks"
                value={totalClicks}
              />
            </section>

            {selectedSession ? (
              <section className="panel">
                <button
                  className="back-button"
                  onClick={() => setSelectedSession(null)}
                >
                  <ArrowLeft size={16} />
                  All sessions
                </button>

                <div className="panel-heading">
                  <div>
                    <h2>Session timeline</h2>
                    <p className="muted">
                      {selectedSession.session_id}
                    </p>
                  </div>
                  <span className="event-count">
                    {events.length} events
                  </span>
                </div>

                {events.length === 0 ? (
                  <p className="empty-state">
                    No events found for this session.
                  </p>
                ) : (
                  <div className="timeline">
                    {events.map((event) => (
                      <div className="timeline-event" key={event._id}>
                        <div
                          className={`timeline-marker ${
                            event.event_type === "click" ? "click" : ""
                          }`}
                        >
                          {event.event_type === "click" ? (
                            <MousePointer2 size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </div>

                        <div className="timeline-content">
                          <div className="event-title">
                            <strong>
                              {event.event_type === "page_view"
                                ? "Page viewed"
                                : "Element clicked"}
                            </strong>
                            <span className="muted">
                              <Clock3 size={13} />
                              {formatDate(event.timestamp)}
                            </span>
                          </div>

                          <p className="event-url">{event.page_url}</p>

                          {event.click && (
                            <span className="coordinate-tag">
                              x: {event.click.x}, y: {event.click.y}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Tracked sessions</h2>
                    <p className="muted">
                      Explore visitor activity and individual journeys.
                    </p>
                  </div>
                  <span className="event-count">
                    {sessions.length} sessions
                  </span>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>SESSION ID</th>
                        <th>EVENTS</th>
                        <th>PAGE VIEWS</th>
                        <th>CLICKS</th>
                        <th>LAST ACTIVITY</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            Loading sessions...
                          </td>
                        </tr>
                      ) : sessions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            No sessions yet. Visit your demo webpage first.
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => (
                          <tr
                            key={session.session_id}
                            className="session-row"
                            onClick={() => openSession(session)}
                          >
                            <td>
                              <span className="session-id">
                                {session.session_id}
                              </span>
                            </td>
                            <td>
                              <strong>{session.totalEvents}</strong>
                            </td>
                            <td>{session.pageViews}</td>
                            <td>{session.clicks}</td>
                            <td className="date-cell">
                              {formatDate(session.lastActivity)}
                            </td>
                            <td>
                              <ChevronRight size={18} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        {view === "heatmap" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Click activity</h2>
                <p className="muted">
                  Explore recorded click positions for a page.
                </p>
              </div>
              <span className="event-count">
                {clicks.length} clicks
              </span>
            </div>

            <label className="select-label" htmlFor="page-select">
              PAGE URL
            </label>

            <select
              id="page-select"
              className="page-select"
              value={selectedPage}
              onChange={(event) => setSelectedPage(event.target.value)}
            >
              {pages.length === 0 && (
                <option value="">No tracked pages</option>
              )}
              {pages.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>

            <div className="heatmap-canvas">
              <div className="heatmap-header">
                <span>CLICK DISTRIBUTION</span>
                <span>Viewport coordinates</span>
              </div>

              <div className="heatmap-stage">
                {clicks.map((click, index) => (
                  <div
                    key={click._id}
                    className="heat-dot"
                    title={`x: ${click.click.x}, y: ${click.click.y}`}
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(0, (click.click.x / window.innerWidth) * 100)
                      )}%`,
                      top: `${Math.min(
                        100,
                        Math.max(0, (click.click.y / window.innerHeight) * 100)
                      )}%`,
                    }}
                  >
                    <span>{index + 1}</span>
                  </div>
                ))}

                {clicks.length === 0 && (
                  <p className="empty-state">
                    No click data for this page yet.
                  </p>
                )}
              </div>

              <p className="heatmap-note">
                Each marker represents a recorded click. Marker positions are
                normalized to your current browser viewport.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
