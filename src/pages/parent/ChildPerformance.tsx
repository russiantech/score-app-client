// v2
// src/pages/parent/ChildPerformance.tsx

import CourseService from "@/services/courses/CourseService";
import { UserService } from "@/services/users/UserService";
import PerformanceService from "@/services/performance/PerformanceService";

import type { User } from "@/types/users";
import type { Course } from "@/types/course";
import type { StudentPerformance } from "@/types/performance";
import type { Grade } from "@/types/course/score";

import { formatDate } from "@/utils/format";
import { getAssessmentTypeColor } from "@/utils/helpers";

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

// type Assessment = {
//   status: "graded" | "completed" | "pending";
// };

// type LessonPerf = {
//   assessments: Assessment[];
// };

const ChildPerformance: React.FC = () => {
  const { childId, courseId } = useParams<{ childId: string; courseId?: string }>();

  const [child, setChild] = useState<User | null>(null);
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(courseId ?? "all");
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // ---------------------------
  // Fetch
  // ---------------------------
/*
  const fetchData = useCallback(async () => {
    if (!childId) return;

    setLoading(true);

    try {
      const [childData, perfRaw] = await Promise.all([
        UserService.getById(childId),
        PerformanceService.getStudentPerformance(
          childId,
          selectedCourse !== "all" ? selectedCourse : undefined
        ),
      ]);

      setChild(childData);

      const perfArray: StudentPerformance[] = Array.isArray(perfRaw)
        ? perfRaw
        : perfRaw
        ? [perfRaw]
        : [];

      setPerformances(perfArray);

      // ---- fetch related courses DRY ----
      const courseIds = [...new Set(perfArray.map(p => p.courseId))];

      const fullCourses = await Promise.all(
        courseIds.map(id => CourseService.getById(id))
      );

      setCourses(fullCourses.map(c => c.course ?? c));

    } catch (err) {
      console.error("Performance fetch failed:", err);
      setPerformances([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [childId, selectedCourse]);
*/
const fetchData = useCallback(async () => {
  if (!childId) return;

  setLoading(true);

  try {
    const childPromise = UserService.getById(childId);

    const perfPromise =
      selectedCourse !== "all"
        ? PerformanceService.getStudentCoursePerformance(
            childId,
            selectedCourse
          )
        : PerformanceService.getStudentPerformance(childId);

    const [childData, perfRaw] = await Promise.all([
      childPromise,
      perfPromise,
    ]);

    setChild(childData);

    const perfArray: StudentPerformance[] = Array.isArray(perfRaw)
      ? perfRaw
      : perfRaw
      ? [perfRaw]
      : [];

    setPerformances(perfArray);

    // ---- fetch related courses DRY ----
    const courseIds = [...new Set(perfArray.map(p => p.courseId))];

    const fullCourses = await Promise.all(
      courseIds.map(id => CourseService.getById(id))
    );

    setCourses(fullCourses.map(c => c.course ?? c));

  } catch (err) {
    console.error("Performance fetch failed:", err);
    setPerformances([]);
    setCourses([]);
  } finally {
    setLoading(false);
  }
}, [childId, selectedCourse]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------------------
  // Helpers
  // ---------------------------

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });
  };

  /*
  const calculateOverallStats = () => {
    if (!performances.length) {
      return {
        averagePercentage: 0,
        totalCompleted: 0,
        totalPending: 0,
        overallGrade: "-" as Grade | "-"
      };
    }

    const avg =
      performances.reduce((s, p) => s + p.overallPercentage, 0) /
      performances.length;

    let completed = 0;
    let pending = 0;

    performances.forEach(p =>
      p.lessons.forEach(l =>
        l.assessments.forEach(a =>
          a.status === "graded" || a.status === "completed"
            ? completed++
            : pending++
        )
      )
    );

    return {
      averagePercentage: avg,
      totalCompleted: completed,
      totalPending: pending,
      overallGrade: performances[0].overallGrade
    };
  };
*/
/*
const calculateOverallStats = (
  performances: StudentPerformance[]
) => {
  if (!performances.length) {
    return {
      averagePercentage: 0,
      totalCompleted: 0,
      totalPending: 0,
      overallGrade: "-" as Grade | "-"
    };
  }

  const avg =
    performances.reduce(
      (sum, p) => sum + p.overallPercentage,
      0
    ) / performances.length;

  let completed = 0;
  let pending = 0;

  performances.forEach(p =>
    p.lessons.forEach(l =>
      l.assessments.forEach(a => {
        if (a.status === "graded" || a.status === "completed") {
          completed++;
        } else {
          pending++;
        }
      })
    )
  );

  return {
    averagePercentage: avg,
    totalCompleted: completed,
    totalPending: pending,
    overallGrade: performances[0].overallGrade
  };
};
*/

const calculateOverallStats = (
  performances: StudentPerformance[]
) => {
  if (!performances.length) {
    return {
      averagePercentage: 0,
      totalCompleted: 0,
      totalPending: 0,
      overallGrade: "-" as Grade | "-"
    };
  }

  const avg =
    performances.reduce(
      (sum, p) => sum + p.overallPercentage,
      0
    ) / performances.length;

  let completed = 0;
  let pending = 0;

  performances.forEach(p =>
    p.lessons.forEach((l: { assessments: any[]; }) =>
      l.assessments.forEach((a: { status: string; }) => {
        if (a.status === "graded" || a.status === "completed") {
          completed++;
        } else {
          pending++;
        }
      })
    )
  );

  return {
    averagePercentage: avg,
    totalCompleted: completed,
    totalPending: pending,
    overallGrade: performances[0].overallGrade
  };
};


  const stats = calculateOverallStats(performances);

  // ---------------------------
  // Guards
  // ---------------------------

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!child) {
    return <div className="alert alert-danger">Child not found.</div>;
  }

  // ---------------------------
  // Render
  // ---------------------------

  return (
    <div className="child-performance">

      {/* header */}
      <div className="mb-4">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/parent/children">My Children</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/parent/children/${childId}`}>{child.names}</Link>
            </li>
            <li className="breadcrumb-item active">Performance</li>
          </ol>
        </nav>
      </div>

      {/* stats */}
      <div className="row mb-4">
        <StatCard label="Overall Average" value={`${Math.round(stats.averagePercentage)}%`} />
        <StatCard label="Completed" value={stats.totalCompleted} />
        <StatCard label="Pending" value={stats.totalPending} />
        <StatCard label="Grade" value={stats.overallGrade} />
      </div>

      {/* filter */}
      <select
        className="form-select mb-4"
        value={selectedCourse}
        onChange={e => setSelectedCourse(e.target.value)}
      >
        <option value="all">All Courses</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>
            {c.code} — {c.title}
          </option>
        ))}
      </select>

      {/* performance */}
      {performances.map(coursePerf => (
        <div key={coursePerf.courseId} className="card mb-4">
          <div className="card-header bg-success text-white">
            {coursePerf.courseName} — {Math.round(coursePerf.overallPercentage)}%
          </div>

          <div className="card-body">

            {/*coursePerf.lessons.map(lesson => (
              <div key={lesson.lessonId} className="mb-3">

                <div
                  className="p-3 bg-light rounded"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleLesson(lesson.lessonId)}
                >
                  {lesson.lessonTitle}
                </div>

                {expandedLessons.has(lesson.lessonId) && (
                  <table className="table table-sm mt-2">
                    <tbody>
                      {lesson.assessments.map(a => (
                        <tr key={a.assessmentId}>
                          <td>{a.assessmentTitle}</td>
                          <td>
                            <span className={`badge bg-${getAssessmentTypeColor(a.type)}`}>
                              {a.type}
                            </span>
                          </td>
                          <td>{a.dueDate ? formatDate(a.dueDate) : "-"}</td>
                          <td>{a.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            ))*/}

            {coursePerf.lessons.map((lesson: any) => (  // Add type
  <div key={lesson.lessonId} className="mb-3">
    <div
      className="p-3 bg-light rounded"
      style={{ cursor: "pointer" }}
      onClick={() => toggleLesson(lesson.lessonId)}
    >
      {lesson.lessonTitle}
    </div>

    {expandedLessons.has(lesson.lessonId) && (
      <table className="table table-sm mt-2">
        <tbody>
          {lesson.assessments.map((a: any) => (  // Add type
            <tr key={a.assessmentId}>
              <td>{a.assessmentTitle}</td>
              <td>
                <span className={`badge bg-${getAssessmentTypeColor(a.type)}`}>
                  {a.type}
                </span>
              </td>
              <td>{a.dueDate ? formatDate(a.dueDate) : "-"}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
))}


          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------------------
// Small DRY stat card
// ---------------------------

const StatCard = ({ label, value }: { label: string; value: any }) => (
  <div className="col-md-3">
    <div className="card text-center">
      <div className="card-body">
        <h5>{value}</h5>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  </div>
);

export default ChildPerformance;
