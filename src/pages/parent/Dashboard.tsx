import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/components/Dashboard.css'; // Import custom styles for the dashboard

const ParentDashboard: React.FC = () => {
  const [children] = useState([
    { 
      id: 1, 
      name: 'Eno Felix', 
      grade: 'Grade 10',
      studentId: 'STU1001',
      enrolledCourses: 4,
      averageGrade: 'A-',
      attendance: '95%',
      overallProgress: 88
    },
    { 
      id: 2, 
      name: 'Rita Jackson', 
      grade: 'Grade 8',
      studentId: 'STU1002',
      enrolledCourses: 3,
      averageGrade: 'B+',
      attendance: '92%',
      overallProgress: 72
    },
  ]);

  const [recentActivities] = useState([
    { id: 1, child: 'Sarah Johnson', activity: 'Scored 92% in Python Quiz', course: 'Advanced Python', date: 'Dec 5, 2024' },
    { id: 2, child: 'Michael Johnson', activity: 'Submitted Web Development Assignment', course: 'Web Fundamentals', date: 'Dec 4, 2024' },
    { id: 3, child: 'Sarah Johnson', activity: 'Attended extra tutoring session', course: 'Data Science', date: 'Dec 3, 2024' },
  ]);

  const [performanceSummary] = useState({
    totalCourses: 7,
    completedAssessments: 24,
    pendingAssignments: 5,
    averageAttendance: '93.5%'
  });

  const calculateProgressCircle = (progress: number) => {
    return {
      '--progress': progress
    } as React.CSSProperties;
  };

  return (
    <div className="page-wrapper">
      <main className="nav-floting">
        <div className="header-content">
          <div className="left-content">
            <h3 className="title">Parent Dashboard</h3>
            <p className="text mb-0">Welcome back, Mr. Johnson</p>
          </div>
          <div className="right-content">
            <span className="badge bg-success user-role-badge">Parent</span>
          </div>
        </div>

        <div className="page-content bg-white p-b60">
          <div className="container">
            <div className="title-bar mb-4">
              <h5 className="title">My Children's Progress</h5>
              <Link to="/parent/track-progress" className="btn btn-sm btn-outline-primary">
                Track All Progress
              </Link>
            </div>

            {/* Summary Stats */}
            <div className="row mb-4">
              <div className="col-md-3 col-6">
                <div className="card course-card">
                  <div className="card-body text-center">
                    <h2 className="text-primary">{children.length}</h2>
                    <p className="card-text mb-0">Children</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card course-card">
                  <div className="card-body text-center">
                    <h2 className="text-success">{performanceSummary.totalCourses}</h2>
                    <p className="card-text mb-0">Total Courses</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card course-card">
                  <div className="card-body text-center">
                    <h2 className="text-warning">{performanceSummary.completedAssessments}</h2>
                    <p className="card-text mb-0">Completed</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card course-card">
                  <div className="card-body text-center">
                    <h2 className="text-info">{performanceSummary.averageAttendance}</h2>
                    <p className="card-text mb-0">Avg Attendance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Children's Cards */}
            <div className="row mb-5">
              {children.map(child => (
                <div className="col-md-6 mb-4" key={child.id}>
                  <div className="card course-card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title">{child.name}</h5>
                          <p className="card-text text-muted">
                            {child.grade} | Student ID: {child.studentId}
                          </p>
                        </div>
                        <div className="progress-circle" style={calculateProgressCircle(child.overallProgress)}>
                          <span>{child.overallProgress}%</span>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="text-center">
                            <h6 className="text-muted mb-1">Courses</h6>
                            <h4 className="text-primary">{child.enrolledCourses}</h4>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <h6 className="text-muted mb-1">Average Grade</h6>
                            <h4 className={`text-${child.averageGrade.includes('A') ? 'success' : 'warning'}`}>
                              {child.averageGrade}
                            </h4>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="text-center">
                            <h6 className="text-muted mb-1">Attendance</h6>
                            <h5 className="text-info">{child.attendance}</h5>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <h6 className="text-muted mb-1">Overall Progress</h6>
                            <h5 className="text-success">{child.overallProgress}%</h5>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <Link 
                          to={`/parent/children/${child.id}`} 
                          className="btn btn-primary"
                        >
                          View Detailed Progress
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="card course-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Recent Activities</h5>
                  <Link to="/parent/track-progress" className="btn btn-sm btn-outline-primary">
                    View Full Timeline
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Child</th>
                        <th>Activity</th>
                        <th>Course</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map(activity => (
                        <tr key={activity.id}>
                          <td>{activity.date}</td>
                          <td><strong>{activity.child}</strong></td>
                          <td>{activity.activity}</td>
                          <td>{activity.course}</td>
                          <td>
                            <span className="badge bg-success">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Pending Assignments</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Michael - Math Homework</span>
                        <span className="badge bg-warning">Due Dec 12</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Sarah - Science Project</span>
                        <span className="badge bg-warning">Due Dec 15</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Sarah - English Essay</span>
                        <span className="badge bg-warning">Due Dec 18</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Quick Actions</h5>
                    <div className="d-grid gap-2">
                      <Link to="/parent/track-progress" className="btn btn-outline-primary">
                        View Progress Reports
                      </Link>
                      <Link to="/parent/children" className="btn btn-outline-success">
                        Manage Children
                      </Link>
                      <button className="btn btn-outline-info">
                        Contact Teachers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ParentDashboard;
