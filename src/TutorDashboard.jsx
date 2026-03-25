import React from 'react';

const TutorDashboard = ({ questions }) => {
  const stats = [
    { label: "Total Requests", value: questions.length, color: "#4318ff", bg: "#f4f7fe" },
    { label: "Completed", value: questions.filter(q => q.status === 'Completed').length, color: "#05cd99", bg: "#e6faf5" },
    { label: "Waiting", value: questions.filter(q => q.status === 'Not Started').length, color: "#ffb547", bg: "#fff9e6" },
    { label: "Replied", value: questions.filter(q => q.status === 'Replied').length, color: "#707eae", bg: "#f4f7fe" }
  ];

  return (
    <div>
      <h1 style={{ color: '#1b2559', fontSize: '2.2rem', fontWeight: '700', marginBottom: '8px' }}>Dashboard Overview</h1>
      <p style={{ color: '#a3aed0', marginBottom: '35px', fontWeight: '500' }}>Welcome back! Here's what's happening with UniSync today.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #f0f2f9' }}>
            <p style={{ color: '#a3aed0', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', margin: '0 0 10px 0' }}>{stat.label}</p>
            <h2 style={{ color: stat.color, fontSize: '2rem', margin: 0 }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f2f9' }}>
        <h3 style={{ color: '#1b2559', marginBottom: '25px', fontSize: '1.2rem' }}>Student Activity Tracker</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f4f7fe', color: '#a3aed0', fontSize: '0.85rem' }}>
              <th style={{ padding: '15px' }}>STUDENT NAME</th>
              <th style={{ padding: '15px' }}>STATUS</th>
              <th style={{ padding: '15px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q._id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                <td style={{ padding: '20px 15px', fontWeight: '700', color: '#1b2559' }}>{q.studentName}</td>
                <td style={{ padding: '15px' }}>
                  <StatusBadge status={q.status} />
                </td>
                <td style={{ padding: '15px', color: '#707eae', fontSize: '0.9rem' }}>
                   {q.status === 'Not Started' ? '🕒 New Request' : q.status === 'Replied' ? '📩 Sent' : '✅ Finished'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Completed': { bg: '#e6faf5', text: '#05cd99' },
    'Replied': { bg: '#eef2ff', text: '#4318ff' },
    'Not Started': { bg: '#fff9e6', text: '#ffb547' }
  }[status || 'Not Started'];

  return (
    <span style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: styles.bg, color: styles.text }}>
      {status ? status.toUpperCase() : 'NOT STARTED'}
    </span>
  );
};

export default TutorDashboard;