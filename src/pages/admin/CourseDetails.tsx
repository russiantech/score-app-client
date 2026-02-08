
// CourseDetails.tsx (Admin)
import type { Course } from '@/types/course';
import type { Lesson } from '@/types/course/lesson';
import { formatDate } from '@/utils/format';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const [course] = useState<Course>({
  id: id || '1',
  code: 'MATH101',
  title: 'Mathematics 101',
  description: 'Comprehensive introduction to mathematics covering algebra, geometry, and basic calculus.',

  tutor_ids: ['t1'],
  tutor_count: 1,

  lessons: [],
  lesson_count: 12,

  // students: [],
  enrolled_count: 25,

  status: 'active',
  is_active: true,

  created_at: '2024-01-15',
  updated_at: '2024-01-15',
});

  const [lessons] = useState<Lesson[]>([
    {
      id: 'l1', module_id: id || '1', title: 'Introduction to Algebra', description: 'Basic algebra concepts', order: 1, total_assessments: 2, created_at: '2024-01-20',
      status: 'upcoming',
      is_published: false
    },
    {
      id: 'l2', module_id: id || '1', title: 'Linear Equations', description: 'Solving linear equations', order: 2, total_assessments: 3, created_at: '2024-01-25',
      status: 'upcoming',
      is_published: false
    }
  ]);

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin/courses">Courses</Link></li>
          <li className="breadcrumb-item active">{course.code}</li>
        </ol>
      </nav>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-primary me-2">{course.code}</span>
                <span className={`badge bg-${course.status === 'active' ? 'success' : 'secondary'}`}>
                  {course.status}
                </span>
              </div>
              <h4 className="mb-2">{course.title}</h4>
              <p className="text-muted mb-2">{course.description}</p>
              <small className="text-muted">
                <i className="fa fa-user-tie me-1"></i>
                Tutor: {course.tutors && course.tutors.length > 0 ? course.tutors[0].names : 'Unassigned'}
              </small>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to={`/admin/courses/${id}/edit`} className="btn btn-outline-primary mb-2">
                <i className="fa fa-edit me-2"></i>Edit Course
              </Link>
              <Link to="/admin/assign-tutors" className="btn btn-outline-info d-block">
                <i className="fa fa-user-plus me-2"></i>Change Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fa fa-info-circle me-1"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>
            <i className="fa fa-book me-1"></i>Lessons ({lessons.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <i className="fa fa-users me-1"></i>Students ({course.enrolled_count})
          </button>
        </li>
      </ul>

      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fa fa-users fa-2x text-primary mb-2"></i>
                <h3 className="mb-0">{course.enrolled_count}</h3>
                <p className="text-muted mb-0">Enrolled Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fa fa-book fa-2x text-success mb-2"></i>
                <h3 className="mb-0">{course.lesson_count}</h3>
                <p className="text-muted mb-0">Total Lessons</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fa fa-calendar fa-2x text-info mb-2"></i>
                <h3 className="mb-0">{formatDate(course.created_at)}</h3>
                <p className="text-muted mb-0">Created Date</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Lesson Title</th>
                    <th>Description</th>
                    <th>Assessments</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map(lesson => (
                    <tr key={lesson.id}>
                      <td>{lesson.order}</td>
                      <td><strong>{lesson.title}</strong></td>
                      <td>{lesson.description}</td>
                      <td><span className="badge bg-info">{lesson.total_assessments || 0}</span></td>
                      <td>{formatDate(lesson.created_at || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="card">
          <div className="card-body">
            <p className="text-muted">Student enrollment details would be displayed here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;