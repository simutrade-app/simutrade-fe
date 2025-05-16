import React from 'react';
import { Card, Carousel, Typography, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface TemplateCarouselProps {
  onSelect: (template: string) => void;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ onSelect }) => {
  // Array of template questions
  const templates = [
    'What are the top export markets for Indonesian coffee?',
    'How do I calculate shipping costs for exports to Europe?',
    'What documents do I need for exporting textiles to the US?',
    'What trade agreements exist between Indonesia and Japan?',
    'How can small businesses start exporting?',
    'What are the major trade trends in 2024?',
    'How do I find reliable distributors in foreign markets?',
    'What are common mistakes for first-time exporters?',
  ];

  const NextArrow = (props: any) => (
    <Button
      {...props}
      className="carousel-arrow next"
      icon={<RightOutlined />}
      type="text"
      shape="circle"
      style={{
        position: 'absolute',
        top: '50%',
        right: '-20px',
        zIndex: 2,
        transform: 'translateY(-50%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    />
  );

  const PrevArrow = (props: any) => (
    <Button
      {...props}
      className="carousel-arrow prev"
      icon={<LeftOutlined />}
      type="text"
      shape="circle"
      style={{
        position: 'absolute',
        top: '50%',
        left: '-20px',
        zIndex: 2,
        transform: 'translateY(-50%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    />
  );

  return (
    <div className="template-carousel" style={{ padding: '0 0 16px 0' }}>
      <Title level={4} style={{ marginBottom: '16px' }}>
        Popular Questions
      </Title>

      <Carousel
        arrows
        dots={false}
        slidesToShow={3}
        slidesToScroll={1}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        autoplay
        autoplaySpeed={5000}
        responsive={[
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
            },
          },
        ]}
      >
        {templates.map((template, index) => (
          <div key={`template-${index}`} style={{ padding: '0 8px' }}>
            <Card
              hoverable
              style={{
                borderRadius: '8px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                borderColor: '#e8e8e8',
              }}
              onClick={() => onSelect(template)}
            >
              <Typography.Paragraph
                ellipsis={{ rows: 3 }}
                style={{
                  margin: 0,
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                {template}
              </Typography.Paragraph>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default TemplateCarousel;
