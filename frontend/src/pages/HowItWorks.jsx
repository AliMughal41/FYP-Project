import {LuUserPlus} from "react-icons/lu"
import {VscTasklist} from "react-icons/vsc"
import {BiSolidLike} from "react-icons/bi"

const HowItWorks = () => {
  return (
    <section className="howItWorks">
      <h3>How Does It Works?</h3>
      <div className="container">
        <div className="card">
          <div className="icon">
            <LuUserPlus/>
          </div>
          <h4>Create an Account </h4>
          <p>
            Sign Up for a free account as a Job Seeker or Employer. Set up your profile to start
            posting jobs and applying for jobs. Customize your profile to your highlight your skills or
            requirements.
          </p>
        </div>
         <div className="card">
          <div className="icon">
            <VscTasklist/>
          </div>
          <h4>Post or Browse Jobs</h4>
          <p>
            Employer can post detailed job decriptions, and a job seekers can browse a comprehensive list of 
            available possitions. Utilize filters to find jobs that match your skills and prefrences.
          </p>
        </div>
         <div className="card">
          <div className="icon">
            <BiSolidLike/>
          </div>
          <h4>Hire or Get Hired</h4>
          <p>
            Employer can shortlist candidates and extend job offers. Job seeker can review job 
            offer and accept possitions that align with their career goals.
          </p>
        </div>
      </div>
    
    </section>
  )
}

export default HowItWorks