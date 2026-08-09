import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { X, MapPin } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';

/**
 * Public Projects Listing page (Portfolio).
 * Fetches projects and allows category filtering.
 * Selecting a project opens a detailed overlay with before-after sliders.
 */
export default function ProjectsList() {
  const { data: projectsData, loading, error, request: fetchProjects } = useApi();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // We can filter client-side or server-side. For this grid, client-side is snappy.
    fetchProjects('/projects').catch(() => {});
  }, [fetchProjects]);

  const projects = projectsData?.data || [];

  // Filter list categories
  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'terrace', label: 'Terraces' },
    { value: 'basement', label: 'Basements & Grouting' },
    { value: 'bathroom', label: 'Bathrooms' },
    { value: 'tank', label: 'Water Tanks' },
    { value: 'facade', label: 'External Facades' },
    { value: 'injection-grouting', label: 'Injection Grouting' },
  ];

  // Filter project records
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.serviceCategory === activeFilter);

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Lock body scroll
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = ''; // Restore body scroll
  };

  return (
    <>
      <Helmet>
        <title>Waterproofing Project Portfolio | CWF Corporation Pune</title>
        <meta
          name="description"
          content="Explore CWF Corporation Pune's completed waterproofing project portfolio. Compare before/after results for terraces, basements, and commercial facades."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>Waterproofing Project Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Scientific Sealing Case Studies across Pune City</p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <ul className="portfolio-filters">
            {categories.map((cat) => (
              <li key={cat.value}>
                <button
                  onClick={() => setActiveFilter(cat.value)}
                  className={`btn ${activeFilter === cat.value ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>

          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading projects"></div>
            </div>
          ) : error ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load projects</h3>
              <p>{error.message}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No project records match the selected category filter.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="card"
                  onClick={() => openModal(project)}
                  style={{ cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div className="card-image-wrapper">
                    {/* Displays After image on grid preview */}
                    <img
                      src={getOptimizedCloudinaryUrl(project.afterImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_500,h_350,c_fill/canyon.jpg', 500)}
                      alt={project.title}
                      className="card-img"
                      loading="lazy"
                    />
                    {project.isFeatured && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          backgroundColor: 'var(--color-accent)',
                          color: 'var(--color-white)',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {project.serviceCategory.replace('-', ' ')}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{project.title}</h3>
                    <p style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: 0 }}>
                      <MapPin size={16} /> {project.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Details Modal overlay */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              <X size={24} />
            </button>

            <h2 id="modal-title" style={{ fontSize: '1.75rem', marginBottom: '1rem', paddingRight: '2rem' }}>
              {selectedProject.title}
            </h2>

            {/* Slider container */}
            <div style={{ marginBottom: '2rem', border: '1px solid var(--color-gray-border)', borderRadius: '6px' }}>
              <BeforeAfterSlider
                beforeImage={selectedProject.beforeImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'}
                afterImage={selectedProject.afterImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'}
                beforeAlt={`Leakage state of ${selectedProject.title}`}
                afterAlt={`Waterproofed state of ${selectedProject.title}`}
              />
            </div>

            <div className="grid-2" style={{ gap: '2rem', gridTemplateColumns: '1.8fr 1fr' }}>
              <div>
                <h3>Project Case Study</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedProject.description}</p>
              </div>

              <div>
                <h3>Specifications</h3>
                <ul className="footer-nav" style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-gray-border)' }}>
                    <span>Location:</span>
                    <strong>{selectedProject.location}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-gray-border)' }}>
                    <span>Client Type:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedProject.clientType}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-gray-border)' }}>
                    <span>Area Treated:</span>
                    <strong>{selectedProject.sqftTreated.toLocaleString()} Sq. Ft.</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span>Completion:</span>
                    <strong>{new Date(selectedProject.completionDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
