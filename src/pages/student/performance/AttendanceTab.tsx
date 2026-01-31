// // (Attendance records)

// // Attendance Tab - Clean Attendance View
// // src/pages/student/performance/AttendanceTab.tsx

// import React from 'react';
// import type { AttendanceSummary, AttendanceRecord } from '@/hooks/usePerformance';

// interface AttendanceTabProps {
// attendance: AttendanceSummary;
// details: AttendanceRecord[];
// }

// const getStatusColor = (status: string): string => {
// if (status === 'present') return 'success';
// if (status === 'absent') return 'danger';
// return 'warning';
// };

// const getStatusIcon = (status: string): string => {
// if (status === 'present') return 'fa-check-circle';
// if (status === 'absent') return 'fa-times-circle';
// return 'fa-clock';
// };

// export const AttendanceTab: React.FC<AttendanceTabProps> = ({ attendance, details }) => {
// return (
// <>
// {/* Summary Cards */}
// <div className="row g-3 mb-4">
// <div className="col-6 col-md-3">
// <div className="card border-0 shadow-sm text-center h-100">
// <div className="card-body py-4">
// <i className="fa fa-check-circle fa-3x text-success mb-3" />
// <h3 className="mb-0">{attendance.present}</h3>
// <small className="text-muted">Present</small>
// </div>
// </div>
// </div>

// <div className="col-6 col-md-3">
// <div className="card border-0 shadow-sm text-center h-100">
// <div className="card-body py-4">
// <i className="fa fa-times-circle fa-3x text-danger mb-3" />
// <h3 className="mb-0">{attendance.absent}</h3>
// <small className="text-muted">Absent</small>
// </div>
// </div>
// </div>

// <div className="col-6 col-md-3">
// <div className="card border-0 shadow-sm text-center h-100">
// <div className="card-body py-4">
// <i className="fa fa-clock fa-3x text-warning mb-3" />
// <h3 className="mb-0">{attendance.late}</h3>
// <small className="text-muted">Late</small>
// </div>
// </div>
// </div>

// <div className="col-6 col-md-3">
// <div className="card border-0 shadow-sm text-center h-100">
// <div className="card-body py-4">
// <i className="fa fa-percentage fa-3x text-info mb-3" />
// <h3 className="mb-0">{attendance.attendance_rate}%</h3>
// <small className="text-muted">Rate</small>
// </div>
// </div>
// </div>
// </div>

// {/* Attendance Records */}
// <div className="card border-0 shadow-sm">
// <div className="card-header bg-white border-0 py-3">
// <h6 className="mb-0">
// <i className="fa fa-calendar-alt me-2" />
// Attendance History
// </h6>
// </div>
// <div className="card-body p-0">
// {details.length === 0 ? (
// <div className="text-center py-5">
// <i className="fa fa-calendar-times fa-3x text-muted mb-3" />
// <h5>No Attendance Records</h5>
// <p className="text-muted">Your attendance history will appear here.</p>
// </div>
// ) : (
// <div className="table-responsive">
// <table className="table table-hover mb-0">
// <thead className="table-light">
// <tr>
// <th>Date</th>
// <th>Status</th>
// <th>Course</th>
// <th className="d-none d-md-table-cell">Module</th>
// <th className="d-none d-lg-table-cell">Lesson</th>
// <th className="d-none d-xl-table-cell">Remarks</th>
// </tr>
// </thead>
// <tbody>
// {details.map((record, idx) => (
// <tr key={idx}>
// <td>
// <small className="fw-semibold">
// {new Date(record.date).toLocaleDateString('en-US', {
// year: 'numeric',
// month: 'short',
// day: 'numeric'
// })}
// </small>
// </td>
// <td>
// <span className={`badge bg-${getStatusColor(record.status)}`}>
// <i className={`fa ${getStatusIcon(record.status)} me-1`} />
// {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
// </span>
// </td>
// <td>
// <div>
// <div className="fw-semibold small">{record.course_title}</div>
// <small className="text-muted">{record.course_code}</small>
// </div>
// </td>
// <td className="d-none d-md-table-cell">
// <small className="text-muted">{record.module_title}</small>
// </td>
// <td className="d-none d-lg-table-cell">
// <small className="text-muted">{record.lesson_title}</small>
// </td>
// <td className="d-none d-xl-table-cell">
// <small className="text-muted">
// {record.remarks || '—'}
// </small>
// </td>
// </tr>
// ))}
// </tbody>
// </table>
// </div>
// )}
// </div>
// </div>
// </>
// );
// };

// export default AttendanceTab;



// v2
// Attendance Tab - Clean & Consistent Attendance View
// src/pages/student/performance/AttendanceTab.tsx

import React from 'react';
import type { AttendanceSummary, AttendanceRecord } from '@/hooks/usePerformance';

interface AttendanceTabProps {
	attendance: AttendanceSummary;
	details: AttendanceRecord[];
}

const STATUS_META: Record<
	string,
	{ label: string; color: string; icon: string }
> = {
	present: { label: 'Present', color: '#28a745', icon: 'fa-check-circle' },
	absent: { label: 'Absent', color: '#dc3545', icon: 'fa-times-circle' },
	late: { label: 'Late', color: '#ffc107', icon: 'fa-clock' },
	rate: { label: 'Rate', color: '#17a2b8', icon: 'fa-percentage' }
};

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
	attendance,
	details
}) => {
	const summaryCards = [
		{ key: 'present', value: attendance.present },
		{ key: 'absent', value: attendance.absent },
		{ key: 'late', value: attendance.late },
		{ key: 'rate', value: `${attendance.attendance_rate}%` }
	];

	const DEFAULT_META = {
	label: 'Unknown',
	color: '#6c757d',
	icon: 'fa-question-circle'
};

	return (
		<>
			{/* Summary Cards */}
			<div className="row g-2 mb-4">
				{summaryCards.map(({ key, value }) => {
					const meta = STATUS_META[key];

					return (
						<div key={key} className="col-6 col-md-4 col-lg-3">
							<div
								className="card border h-100"
								style={{ borderColor: meta.color }}
							>
								<div className="card-body p-3 text-center">
									<div
										className="rounded-circle mx-auto mb-2"
										style={{
											width: 50,
											height: 50,
											backgroundColor: meta.color,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#fff',
											fontSize: '1.2rem'
										}}
									>
										<i className={`fa ${meta.icon}`} />
									</div>

									<div className="fw-bold">{value}</div>
									<small className="text-muted">{meta.label}</small>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Attendance Records */}
			<div className="card border">
				<div className="card-header bg-white py-3">
					<h6 className="mb-0 fw-semibold">
						<i className="fa fa-calendar-alt me-2 text-primary" />
						Attendance History
					</h6>
				</div>

				<div className="card-body p-0">
					{details.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<i className="fa fa-calendar-times fa-2x mb-2" />
							<div className="fw-semibold">No Attendance Records</div>
							<small>Your attendance history will appear here</small>
						</div>
					) : (
						<div className="table-responsive">
							<table className="table table-hover align-middle mb-0">
								<thead className="table-light">
									<tr>
										<th>Date</th>
										<th>Status</th>
										<th>Course</th>
										<th className="d-none d-md-table-cell">Module</th>
										<th className="d-none d-lg-table-cell">Lesson</th>
										<th className="d-none d-xl-table-cell">Remarks</th>
									</tr>
								</thead>

								<tbody>
									{details.map((record, idx) => {
                                const statusKey = record.status?.toLowerCase();
                                const meta = STATUS_META[statusKey] ?? DEFAULT_META;

                                return (
                                    <tr key={idx}>
                                        <td className="fw-semibold small">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>

                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: meta.color,
                                                    color: '#fff'
                                                }}
                                            >
                                                <i className={`fa ${meta.icon} me-1`} />
                                                {meta.label}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold small text-truncate">
                                                {record.course_title}
                                            </div>
                                            <small className="text-muted">{record.course_code}</small>
                                        </td>

                                        <td className="d-none d-md-table-cell text-muted small">
                                            {record.module_title}
                                        </td>

                                        <td className="d-none d-lg-table-cell text-muted small">
                                            {record.lesson_title}
                                        </td>

                                        <td className="d-none d-xl-table-cell text-muted small">
                                            {record.remarks || '—'}
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                        </table>
                        </div>
                        )}
                        </div>
                        </div>
                        </>
                        );
};

export default AttendanceTab;
