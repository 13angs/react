import React, { useState } from 'react';
import flexMessageData from './flex-message.json'; // Adjust the path as needed
import './App.css'

const FlexMessageEditor = () => {
  // Use state to manage the Flex Message data
  const [messageData, setMessageData] = useState(flexMessageData);

  // Update data function
  const handleChange = (path, value) => {
    setMessageData((prevData) => {
      const updatedData = { ...prevData };
      const keys = path.split('.');
      let current = updatedData;

      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });

      return updatedData;
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Flex Message Preview Section */}
      <div className="preview-section" style={{ flex: 1, padding: '20px' }}>
        <FlexMessage data={messageData} />
      </div>

      {/* Editable Fields Section */}
      <div className="editor-section" style={{ flex: 1, padding: '20px', borderLeft: '1px solid #ddd' }}>
        <h3>Edit Flex Message</h3>
        
        {/* Hero Section */}
        {messageData.hero && (
          <>
            <h4>Hero</h4>
            <label>
              Image URL:
              <input
                type="text"
                value={messageData.hero.url}
                onChange={(e) => handleChange('hero.url', e.target.value)}
              />
            </label>
            <label>
              Link URL:
              <input
                type="text"
                value={messageData.hero.action.uri}
                onChange={(e) => handleChange('hero.action.uri', e.target.value)}
              />
            </label>
          </>
        )}

        {/* Body Section */}
        <h4>Body</h4>
        {messageData.body.contents?.map((content, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            {content.type === 'text' && (
              <>
                <label>
                  Text:
                  <input
                    type="text"
                    value={content.text}
                    onChange={(e) => handleChange(`body.contents.${index}.text`, e.target.value)}
                  />
                </label>
                <label>
                  Color:
                  <input
                    type="color"
                    value={content.color}
                    onChange={(e) => handleChange(`body.contents.${index}.color`, e.target.value)}
                  />
                </label>
              </>
            )}
          </div>
        ))}

        {/* Footer Section */}
        <h4>Footer</h4>
        {messageData.footer.contents?.map((content, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            {content.type === 'button' && (
              <>
                <label>
                  Button Label:
                  <input
                    type="text"
                    value={content.action.label}
                    onChange={(e) => handleChange(`footer.contents.${index}.action.label`, e.target.value)}
                  />
                </label>
                <label>
                  Button URL:
                  <input
                    type="text"
                    value={content.action.uri}
                    onChange={(e) => handleChange(`footer.contents.${index}.action.uri`, e.target.value)}
                  />
                </label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// FlexMessage component to render the preview
const FlexMessage = ({ data }) => {
  const { hero, body, footer } = data;

  return (
    <div className="bubble">
      {/* Hero Section */}
      {hero && (
        <div className="hero">
          <a href={hero.action?.uri} target="_blank" rel="noopener noreferrer">
            <img
              src={hero.url}
              alt="Hero"
              style={{
                width: '100%',
                aspectRatio: hero.aspectRatio.replace(':', '/'),
                objectFit: hero.aspectMode,
              }}
            />
          </a>
        </div>
      )}

      {/* Body Section */}
      <div className="body">
        {body?.contents?.map((content, index) => {
          switch (content.type) {
            case 'box':
              return (
                <div
                  key={index}
                  className="horizontal-box"
                  style={{ flexDirection: content.layout === 'horizontal' ? 'row' : 'column' }}
                >
                  {content.contents?.map((item, idx) => {
                    if (item.type === 'text') {
                      return (
                        <span
                          key={idx}
                          style={{
                            fontWeight: item.weight,
                            fontSize: item.size,
                            color: item.color,
                            textAlign: item.align,
                            margin: item.margin,
                          }}
                        >
                          {item.text}
                        </span>
                      );
                    } else if (item.type === 'image') {
                      return (
                        <img
                          key={idx}
                          src={item.url}
                          alt=""
                          style={{
                            width: item.size,
                            objectFit: item.aspectMode,
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              );
            case 'text':
              return (
                <p
                  key={index}
                  style={{
                    fontWeight: content.weight,
                    fontSize: content.size,
                    color: content.color,
                    textAlign: content.align,
                    margin: content.margin,
                  }}
                >
                  {content.text}
                </p>
              );
            case 'separator':
              return <hr key={index} className="separator" />;
            default:
              return null;
          }
        })}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="footer">
          {footer.contents?.map((content, index) => {
            if (content.type === 'button') {
              return (
                <button
                  key={index}
                  className={content.style === 'primary' ? 'primary-button' : 'secondary-button'}
                  onClick={() => window.open(content.action.uri, '_blank')}
                >
                  {content.action.label}
                </button>
              );
            } else if (content.type === 'image') {
              return (
                <img
                  key={index}
                  src={content.url}
                  alt="QR Code"
                  className="qr-code"
                  style={{ width: content.size }}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default FlexMessageEditor;
