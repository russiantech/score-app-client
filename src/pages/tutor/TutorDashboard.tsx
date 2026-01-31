

// v4 - with re-usable stats
// TutorDashboard.tsx
import { useTutorCourses } from "@/hooks/useTutorCourses";
import DashboardCourses from "../shared/DashboardCourses";
import DashboardStats from "../shared/DashboardStats";

const TutorDashboard = () => {
  const { courses, loading, stats } = useTutorCourses();

  return (
    <div className="container-fluid">
      <div className="row g-3">

        {/* ===== STATS ===== */}
        <div className="col-12">
          <DashboardStats stats={stats} loading={loading} />
        </div>

        {/* ===== COURSES ===== */}
        <div className="col-12">
          <DashboardCourses courses={courses} loading={loading} />
        </div>

      </div>
    </div>
  );
};

export default TutorDashboard;
