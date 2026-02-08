// shared/DashboardStats.tsx
import { StatCard } from "@/components/cards/StatCards";
// import { FiBook, FiUsers, FiCheckCircle } from "react-icons/fi";

interface Stats {
  total: number;
  active: number;
  students: number;
}

const DashboardStats = ({ stats, loading }: { stats?: Stats; loading?: boolean }) => {
  const items = [
    {
      label: "Total Courses",
      value: stats?.total ?? 0,
      // icon: <FiBook />,
      icon: 'fa fa-book',
      color: "primary",
    },
    {
      label: "Active Courses",
      value: stats?.active ?? 0,
      // icon: <FiCheckCircle />,
      icon: 'fa fa-check-circle',
      color: "success",
    },
    {
      label: "Students",
      value: stats?.students ?? 0,
      // icon: <FiUsers />,
      icon: 'fa fa-users',
      color: "info",
    },
  ];

  return (
    <div className="row g-3">
      {items.map((item) => (

        // <div key={item.label} className="col-12 col-sm-6 col-lg-4">
        //   <div className={`card bg-${item.color} text-white border-0 shadow-sm`}>
        //     <div className="card-body d-flex align-items-center gap-3">
        //       <div
        //         className={`rounded-circle bg-opacity-10 p-3`}
        //       >
        //         {item.icon}
        //       </div>

        //       <div>
        //         <div className="fw-bold fs-4">
        //           {loading ? "…" : item.value}
        //         </div>
        //         <div className="small">{item.label}</div>
        //       </div>
        //     </div>
        //   </div>
          
        // </div>

        <StatCard
          key={item.label}
          value={loading ? "…" : item.value}
          label={item.label}
          icon={item.icon}
          bgColor={item.color}
        />

      ))}
    </div>
  );
};

export default DashboardStats;
