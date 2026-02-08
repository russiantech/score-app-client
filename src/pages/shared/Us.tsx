
const Us = () => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row">

              {/* INTRO */}
              <div className="col-12 mb-4">
                <div className="mb-3">
                  <h3 className="card-title card-intro-title mb-2">
                    About Us
                  </h3>
                  <p className="text-muted">
                    We are a technology and training company committed to improving
                    learning outcomes for children and adults by bridging the gap
                    between education, data, and parental involvement.
                  </p>
                </div>
              </div>

              {/* WHY WE BUILT THE PLATFORM */}
              <div className="col-12 mb-4">
                <div className="mb-3">
                  <h4 className="card-title card-intro-title mb-1">
                    Why This Platform Exists
                  </h4>
                  <p>
                    From years of hands-on training and school support, we observed
                    that many parents are often unsure about what their children are
                    learning, how they are performing, or where they need support.
                    Our Score & Performance App was built to solve this exact problem.
                  </p>
                </div>

                <ul className="list-icons">
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Lack of real-time visibility into students’ academic performance
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Delayed or unclear communication between parents and instructors
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Difficulty tracking progress across courses, lessons, and terms
                  </li>
                </ul>
              </div>

              {/* SOLUTION-ORIENTED */}
              <div className="col-12 mb-4">
                <div className="mb-3">
                  <h4 className="card-title card-intro-title mb-1">
                    Solution-Oriented by Design
                  </h4>
                  <p>
                    Our platform is designed to restore confidence and trust by giving
                    parents clear, structured, and up-to-date insights into their
                    children’s learning journey.
                  </p>
                </div>

                <ul className="list-icons">
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-check text-info"></i>
                    </span>
                    Parents can view scores, instructor feedback, and performance summaries
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-check text-info"></i>
                    </span>
                    Instructors can upload assessments, comments, and learning outcomes
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-check text-info"></i>
                    </span>
                    Administrators maintain oversight and data integrity
                  </li>
                </ul>
              </div>

              {/* DATA-DRIVEN */}
              <div className="col-12 mb-4">
                <div className="mb-3">
                  <h4 className="card-title card-intro-title mb-1">
                    Data-Driven Performance Tracking
                  </h4>
                  <p>
                    We believe decisions should be backed by data, not assumptions.
                    The app transforms raw scores into meaningful insights that help
                    parents and instructors identify strengths, gaps, and progress trends.
                  </p>
                </div>

                <ul className="list-icons">
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-chevron-right"></i>
                    </span>
                    Continuous performance tracking across courses and assessments
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-chevron-right"></i>
                    </span>
                    Historical records for long-term academic monitoring
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="fa fa-chevron-right"></i>
                    </span>
                    Clear instructor comments tied directly to results
                  </li>
                </ul>
              </div>

              {/* USER FRIENDLY */}
              <div className="col-12 mb-2">
                <div className="mb-3">
                  <h4 className="card-title card-intro-title mb-1">
                    Built for Ease, Built for Trust
                  </h4>
                  <p>
                    The platform is intentionally simple, mobile-friendly, and accessible.
                    Parents do not need technical knowledge to understand their child’s
                    progress — everything is presented clearly and professionally.
                  </p>
                </div>

                <ul className="list-icons">
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Clean dashboards optimized for mobile and desktop
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Secure role-based access for parents, instructors, and admins
                  </li>
                  <li>
                    <span className="align-middle me-2">
                      <i className="ti-angle-right"></i>
                    </span>
                    Designed to scale with schools, academies, and training centers
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Us


// v2
// import React from 'react'

// const Us = () => {
//   return (
//     <div className="row">
//       <div className="col-12">
//         <div className="card">
//           <div className="card-body">
//             <div className="row">

//               <div className="col-12 mb-4">
//                 <h4 className="card-title card-intro-title mb-2">
//                   About Score App
//                 </h4>
//                 <p className="text-muted">
//                   Score App is a learning performance and progress tracking platform
//                   developed by <strong>Dunistech Academy</strong> to help parents,
//                   instructors, and administrators stay connected to students’ academic
//                   growth.
//                 </p>
//               </div>

//               <div className="col-12 mb-3">
//                 <ul className="list-icons">
//                   <li>
//                     <span className="align-middle me-2">
//                       <i className="ti-angle-right"></i>
//                     </span>
//                     Enables parents to easily view scores, feedback, and progress
//                   </li>
//                   <li>
//                     <span className="align-middle me-2">
//                       <i className="ti-angle-right"></i>
//                     </span>
//                     Helps instructors record assessments and performance insights
//                   </li>
//                   <li>
//                     <span className="align-middle me-2">
//                       <i className="ti-angle-right"></i>
//                     </span>
//                     Builds trust through clear, data-driven academic reporting
//                   </li>
//                 </ul>
//               </div>

//               <div className="col-12">
//                 <p>
//                   Designed from real classroom experience, Score App simplifies
//                   performance tracking while improving transparency, confidence,
//                   and communication in education.
//                 </p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Us
