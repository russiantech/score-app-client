
import type { StatCardProps } from "@/types/stats";

export const StatCard: React.FC<StatCardProps> = ({ value, label, icon, bgColor, loading }) => (
  <div className="col-6 col-md-4 mb-3">
    {/* <div className={`card ${bgColor} text-white shadow-sm h-100`}> */}
       <div className={`card bg-${bgColor} text-white border-0 shadow-sm`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status" />
              ) : (
                value
              )}
            </h3>
            <p className="mb-0 small opacity-75 text-truncate">{label}</p>
          </div>
          <i className={`${icon} fa-2x opacity-25 ms-2 flex-shrink-0`} />
        </div>
      </div>
    </div>
  </div>
);

export default StatCard;

