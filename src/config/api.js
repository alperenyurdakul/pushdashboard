// API Configuration - Tek yerden yönetim
const API_CONFIG = {
  // IP adresi buradan değiştirilecek
  SERVER_IP: 'api.faydana.com',
  PORT: '',
  USE_HTTPS: true, // HTTPS kullan (hosting için gerekli)
  
  // API Base URL - otomatik oluşturulur
  get BASE_URL() {
    const protocol = this.USE_HTTPS ? 'https' : 'http';
    const port = this.PORT ? `:${this.PORT}` : '';
    const url = `${protocol}://${this.SERVER_IP}${port}`;
    console.log('🔗 Dashboard API URL:', url); // Debug için
    return url;
  }
};

export default API_CONFIG;
