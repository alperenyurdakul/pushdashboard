import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import API_CONFIG from '../config/api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [pendingBanners, setPendingBanners] = useState([]);
  const [approvedBanners, setApprovedBanners] = useState([]);
  const [rejectedBanners, setRejectedBanners] = useState([]);
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadPendingBanners(),
      loadApprovedBanners(),
      loadRejectedBanners(),
      loadAllBanners()
    ]);
  };

  const loadPendingBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Event'leri de al
      const eventsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/events/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const eventsData = await eventsResponse.json();
      
      // Banner'lar ve event'leri birleştir
      let allPending = [];
      if (data.success) {
        allPending = [...data.data];
      }
      if (eventsData.success && eventsData.data.length > 0) {
        const formattedEvents = eventsData.data.map(event => ({
          _id: event._id,
          title: event.title || event.eventTitle,
          description: event.description || event.eventDescription,
          category: event.category,
          contentType: 'event',
          approvalStatus: 'pending',
          createdAt: event.createdAt,
          startDate: event.startDate,
          endDate: event.endDate,
          restaurant: { name: event.organizerName || 'Kullanıcı' },
          bannerImage: event.bannerImage,
          isEvent: true
        }));
        allPending = [...allPending, ...formattedEvents];
      }
      
      setPendingBanners(allPending);
    } catch (error) {
      console.error('Pending yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedBanners = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/approved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setApprovedBanners(data.data);
      }
    } catch (error) {
      console.error('Approved yükleme hatası:', error);
    }
  };

  const loadRejectedBanners = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/rejected`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRejectedBanners(data.data);
      }
    } catch (error) {
      console.error('Rejected yükleme hatası:', error);
    }
  };

  const loadAllBanners = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAllBanners(data.data);
      }
    } catch (error) {
      console.error('All banners yükleme hatası:', error);
    }
  };

  const handleApproveBanner = async (banner) => {
    if (!window.confirm('Bu içeriği onaylamak istediğinize emin misiniz?')) return;

    try {
      const isEvent = banner.isEvent || banner.contentType === 'event';
      const endpoint = isEvent 
        ? `${API_CONFIG.BASE_URL}/api/admin/events/${banner._id}/approve`
        : `${API_CONFIG.BASE_URL}/api/admin/banners/${banner._id}/approve`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        alert(isEvent ? 'Etkinlik başarıyla onaylandı!' : 'Kampanya başarıyla onaylandı!');
        loadAllData();
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Onaylanırken hata oluştu!');
    }
  };

  const handleRejectBanner = async () => {
    if (!selectedBanner || !rejectReason.trim()) {
      alert('Lütfen red sebebi girin!');
      return;
    }

    try {
      const isEvent = selectedBanner.isEvent || selectedBanner.contentType === 'event';
      const endpoint = isEvent 
        ? `${API_CONFIG.BASE_URL}/api/admin/events/${selectedBanner._id}/reject`
        : `${API_CONFIG.BASE_URL}/api/admin/banners/${selectedBanner._id}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(isEvent ? 'Etkinlik reddedildi!' : 'Kampanya reddedildi!');
        setRejectModalOpen(false);
        setRejectReason('');
        setSelectedBanner(null);
        loadAllData();
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert('Reddedilirken hata oluştu!');
    }
  };

  const openRejectModal = (banner) => {
    setSelectedBanner(banner);
    setRejectModalOpen(true);
  };

  const openDetailModal = (banner) => {
    setSelectedBanner(banner);
    setDetailModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getBannerImageUrl = (banner) => {
    if (!banner.bannerImage) return 'https://via.placeholder.com/400x225';
    if (banner.bannerImage.startsWith('http')) return banner.bannerImage;
    return `${API_CONFIG.BASE_URL}/${banner.bannerImage}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Onay Bekliyor', class: 'badge-pending' },
      approved: { text: 'Onaylandı', class: 'badge-approved' },
      rejected: { text: 'Reddedildi', class: 'badge-rejected' }
    };
    return badges[status] || badges.pending;
  };

  const filterBanners = (banners) => {
    if (!searchQuery.trim()) return banners;
    
    const query = searchQuery.toLowerCase();
    return banners.filter(banner => 
      banner.title?.toLowerCase().includes(query) ||
      banner.restaurant?.name?.toLowerCase().includes(query) ||
      banner.category?.toLowerCase().includes(query)
    );
  };

  const getCurrentBanners = () => {
    switch (activeTab) {
      case 'pending':
        return filterBanners(pendingBanners);
      case 'approved':
        return filterBanners(approvedBanners);
      case 'rejected':
        return filterBanners(rejectedBanners);
      case 'all':
        return filterBanners(allBanners);
      default:
        return [];
    }
  };

  const currentBanners = getCurrentBanners();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="admin-avatar">
              <span className="admin-avatar-text">AD</span>
            </div>
            <div className="admin-info">
              <h1 className="admin-name">Admin</h1>
              <p className="admin-role">Yönetici</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <a href="#" className="nav-item">
              <span className="material-icons">dashboard</span>
              <p>Dashboard</p>
            </a>
            <a href="#" className="nav-item active">
              <span className="material-icons">task_alt</span>
              <p>Onay Yönetimi</p>
            </a>
            <a href="#" className="nav-item">
              <span className="material-icons">storefront</span>
              <p>İşletmeler</p>
            </a>
            <a href="#" className="nav-item">
              <span className="material-icons">group</span>
              <p>Kullanıcılar</p>
            </a>
            <a href="#" className="nav-item">
              <span className="material-icons">settings</span>
              <p>Ayarlar</p>
            </a>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="btn-primary-full">Yeni Ekle</button>
          <div className="sidebar-footer-links">
            <a href="#" className="footer-link">
              <span className="material-icons">help</span>
              <p>Yardım</p>
            </a>
            <a href="#" className="footer-link" onClick={() => {
              localStorage.removeItem('userToken');
              window.location.href = '/login';
            }}>
              <span className="material-icons">logout</span>
              <p>Çıkış Yap</p>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Page Heading */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Kampanya & Etkinlik Yönetimi</h1>
              <p className="page-subtitle">İşletmeler tarafından gönderilen kampanya ve etkinlikleri yönetin.</p>
            </div>
            <div>
              <button 
                className="btn-primary-full"
                onClick={async () => {
                  try {
                    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/test/batch-trigger`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    const data = await response.json();
                    if (data.success) {
                      alert('✅ Batch başarıyla tetiklendi! Backend loglarını kontrol et.');
                    } else {
                      alert('❌ Hata: ' + (data.message || 'Bilinmeyen hata'));
                    }
                  } catch (error) {
                    console.error('Batch tetikleme hatası:', error);
                    alert('❌ Bağlantı hatası: ' + error.message);
                  }
                }}
                style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}
              >
                🧪 Batch Test Et
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-icon">
                <span className="material-icons">search</span>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="İşletme adı veya kampanya türüne göre ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Bekleyen Onaylar ({pendingBanners.length})
              </button>
              <button
                className={`tab ${activeTab === 'approved' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('approved')}
              >
                Onaylananlar
              </button>
              <button
                className={`tab ${activeTab === 'rejected' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                Reddedilenler
              </button>
              <button
                className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tümü
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : currentBanners.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons empty-icon">inbox</span>
              <p>İçerik bulunamadı</p>
            </div>
          ) : (
            <div className="cards-grid">
              {currentBanners.map((banner) => (
                <div key={banner._id} className="card">
                  <div
                    className="card-image"
                    style={{ backgroundImage: `url(${getBannerImageUrl(banner)})` }}
                  />
                  
                  <div className="card-content">
                    <div className="card-header">
                      <p className="card-title">{banner.title}</p>
                      <span className={`badge ${getStatusBadge(banner.approvalStatus).class}`}>
                        {getStatusBadge(banner.approvalStatus).text}
                      </span>
                    </div>
                    
                    <p className="card-subtitle">
                      {banner.restaurant?.name || 'Kullanıcı'} - {banner.contentType === 'event' ? 'Etkinlik' : 'Kampanya'}
                    </p>
                    
                    <p className="card-date">
                      {banner.isEvent 
                        ? formatDateRange(banner.startDate, banner.endDate)
                        : formatDate(banner.createdAt)
                      }
                    </p>
                  </div>

                  <div className="card-actions">
                    {activeTab === 'pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApproveBanner(banner)}
                        >
                          <span className="material-icons">check_circle</span>
                          <span>Onayla</span>
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => openRejectModal(banner)}
                        >
                          <span className="material-icons">cancel</span>
                          <span>Reddet</span>
                        </button>
                    </>
                  )}
                    <button
                      className="btn-detail"
                      onClick={() => openDetailModal(banner)}
                    >
                      <span>Detaylar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {detailModalOpen && selectedBanner && (
        <div className="modal-overlay" onClick={() => setDetailModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBanner.contentType === 'event' ? 'Etkinlik' : 'Kampanya'} Detayları</h2>
              <button className="modal-close" onClick={() => setDetailModalOpen(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="modal-content">
              {selectedBanner.bannerImage && (
                <img 
                  src={getBannerImageUrl(selectedBanner)} 
                  alt={selectedBanner.title}
                  className="modal-image"
                />
              )}
              
              <div className="modal-detail">
                <h3>
                  {selectedBanner.title}
                  <span className={`badge badge-inline ${getStatusBadge(selectedBanner.approvalStatus).class}`} style={{ marginLeft: 8 }}>
                    {getStatusBadge(selectedBanner.approvalStatus).text}
                  </span>
                </h3>
                <p className="modal-description">{selectedBanner.description}</p>
                
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">İşletme/Organizatör</span>
                    <span className="detail-value">{selectedBanner.restaurant?.name || 'Kullanıcı'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Kategori</span>
                    <span className="detail-value">{selectedBanner.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tür</span>
                    <span className="detail-value">
                    {selectedBanner.contentType === 'event' ? 'Etkinlik' : 'Kampanya'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durum</span>
                    <span className={`badge ${getStatusBadge(selectedBanner.approvalStatus).class}`}>
                      {getStatusBadge(selectedBanner.approvalStatus).text}
                    </span>
                  </div>
                  {selectedBanner.isEvent && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Tarih Aralığı</span>
                      <div className="meta-box">
                        <span className="detail-value">
                          {formatDateRange(selectedBanner.startDate, selectedBanner.endDate)}
                        </span>
                      </div>
                    </div>
                  )}
                  {!selectedBanner.isEvent && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Oluşturulma</span>
                      <div className="meta-box">
                        <span className="detail-value">{formatDate(selectedBanner.createdAt)}</span>
                      </div>
                    </div>
                  )}
                {selectedBanner.rejectedReason && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Red Sebebi</span>
                      <div className="alert-error">{selectedBanner.rejectedReason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDetailModalOpen(false)}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="modal-overlay" onClick={() => setRejectModalOpen(false)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>İçeriği Reddet</h2>
              <button className="modal-close" onClick={() => setRejectModalOpen(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="modal-content">
              <label className="input-label">Red Sebebi</label>
              <textarea
                className="textarea"
                rows="4"
                placeholder="Lütfen red sebebini açıklayın..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setRejectModalOpen(false)}>
                İptal
              </button>
              <button className="btn-reject" onClick={handleRejectBanner}>
                <span className="material-icons">cancel</span>
            Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
