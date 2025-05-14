import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
}

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockData | null>(null);
  
  useEffect(() => {
    const loadStockData = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, we're creating mock data based on the symbol
        setTimeout(() => {
          const mockData: StockData = {
            symbol: symbol?.toUpperCase() || 'UNKNOWN',
            companyName: `${symbol?.toUpperCase() || 'Unknown'} Corporation`,
            price: 150.25 + Math.random() * 50,
            change: (Math.random() * 10) - 5,
            changePercent: (Math.random() * 5) - 2.5,
            volume: Math.floor(Math.random() * 10000000),
            marketCap: Math.floor(Math.random() * 1000000000000),
            pe: 15 + Math.random() * 30,
            sector: 'Technology'
          };
          
          setStockData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading stock data:', error);
        setLoading(false);
      }
    };
    
    if (symbol) {
      loadStockData();
    } else {
      navigate('/dashboard/market', { replace: true });
    }
  }, [symbol, navigate]);
  
  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }
  
  if (!stockData) {
    return <div className="error">Stock data not available</div>;
  }
  
  const isPositive = stockData.change >= 0;
  
  return (
    <div className="stock-detail-page">
      <div className="stock-header">
        <h1>{stockData.symbol}</h1>
        <h2>{stockData.companyName}</h2>
        <div className="stock-price-container">
          <div className="stock-price">${stockData.price.toFixed(2)}</div>
          <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="stock-details">
        <div className="detail-row">
          <div className="detail-label">Volume</div>
          <div className="detail-value">{stockData.volume.toLocaleString()}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Market Cap</div>
          <div className="detail-value">${(stockData.marketCap / 1000000000).toFixed(2)}B</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">P/E Ratio</div>
          <div className="detail-value">{stockData.pe.toFixed(2)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Sector</div>
          <div className="detail-value">{stockData.sector}</div>
        </div>
      </div>
      
      <div className="stock-chart">
        <h3>Price Chart</h3>
        <div className="chart-placeholder">
          Chart visualization coming soon
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="buy-button">Buy</button>
        <button className="sell-button">Sell</button>
        <button className="watchlist-button">Add to Watchlist</button>
      </div>
    </div>
  );
};

export default StockDetailPage; 