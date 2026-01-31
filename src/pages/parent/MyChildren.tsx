// src/pages/parent/MyChildren.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserService } from '@/services/users/UserService';
// import UserService from '@/services/users/UserService';
// import apiService from '../../services/api';

const MyChildren: React.FC = () => {
  const { auth } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    if (!auth?.user?.id) return;
    try {
      const data = await UserService.getParentChildren(auth.user.id);
      setChildren(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-children">
      <div className="title-bar mb-4">
        <h5 className="title">My Children</h5>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row">
          {children.map(child => (
            <div key={child.id} className="col-md-6 mb-4">
              <div className="card course-card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{child.firstName} {child.lastName}</h5>
                      <p className="text-muted small mb-0">{child.email}</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <span className="badge bg-primary">{child.enrolledCourses} Courses</span>
                    </div>
                    <div className="col-6 text-end">
                      <span className="badge bg-success">Avg: {child.averagePerformance}%</span>
                    </div>
                  </div>
                  
                  <Link to={`/parent/children/${child.id}/performance`} className="btn btn-sm btn-success w-100">
                    View Performance
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChildren;
