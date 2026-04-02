import React from 'react';

/**
 * RatingStars — reusable star rating widget.
 * Props:
 *   rating     {number}   current rating value (0–5)
 *   onChange   {fn}       called with new rating number when a star is clicked
 *   readOnly   {boolean}  if true, stars are not clickable
 */
export default function RatingStars({ rating = 0, onChange, readOnly = false }) {
  const value = Number(rating) || 0;

  return (
    <div
      className="rating-container"
      style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}
    >
      <div style={{ display: 'flex' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= Math.round(value) ? 'active' : ''}`}
            onClick={(e) => {
              if (readOnly) return;
              e.stopPropagation();
              e.preventDefault();
              onChange && onChange(star);
            }}
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              color: star <= Math.round(value) ? '#f59e0b' : '#d1d5db',
              fontSize: 20,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>
      <span
        style={{
          marginLeft: 4,
          backgroundColor: '#f59e0b',
          color: '#000',
          fontWeight: 900,
          fontSize: 12,
          padding: '2px 7px',
          borderRadius: 10,
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}
