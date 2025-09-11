import mongoose from "mongoose";

// const educationSchema = new mongoose.Schema({
//     school: {
//         type: String,
//         default: "",
//     },
//     degree: {
//         type: String,
//         default: "",
//     },
//     fieldOfStudy: {
//         type: String,
//         default: "",
//     },
//     years: {
//     type: String, 
//     default: "",
//   }
// });

const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
  startMonth: {
    type: String,
    default: "",
  },
  startYear: {
    type: String,
    default: "",
  },
  endMonth: {
    type: String,
    default: "",
  },
  endYear: {
    type: String,
    default: "",
  },
});

// const workSchema = new mongoose.Schema({
//     company: {
//         type: String,
//         default: "",
//     },
//     position: {
//         type: String,
//         default: "",
//     },
//     years:{
//         type: String,
//         default: "",
//     }
// })

const workSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    employee_type: {
        type: String, 
        default: "",
    }, 
    company_or_organization: {
        type: String,
        default:"",
    },
    position: {
        type: String,
        default: "",
    }, 
    startMonth: {
        type: String,
        default: "",
    },
    startYear: {
        type: String,
        default: "",
    },
    endMonth: {
        type: String,
        default: "",
    },
    endYear: {
        type: String,
        default: "",
    },
    location: {
      type: String,
      default:"",
    },
    location_type: {
        type: String,
        default: "",
    },
})

/* 

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bio: { type: String, default: "" },
  currentPost: { type: String, default: "" },
  pastWork: { type: [workSchema], default: [] },
  education: { type: [educationSchema], default: [] },
});
*/
const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    bio:{
        type: String,
        default: "",
    },
    currentPost: {
        type: String,
        default: "",
    },
    pastWork: {
        type:[workSchema],
        default:[],
    },
    education: {
        type: [educationSchema],
        default: [],
    },
});


// ✅ Normalize fields before saving
ProfileSchema.pre("save", function (next) {
  // Normalize pastWork
  this.pastWork = this.pastWork.map((work) => ({
    title: work.title || "",
    employee_type: work.employee_type || "",
    company_or_organization: work.company_or_organization || "",
    position: work.position || "",
    startMonth: work.startMonth || "",
    startYear: work.startYear || "",
    endMonth: work.endMonth || "",
    endYear: work.endYear || "",
    location: work.location || "",
    location_type: work.location_type || "",
  }));

  // Normalize education
  this.education = this.education.map((edu) => ({
    school: edu.school || "",
    degree: edu.degree || "",
    fieldOfStudy: edu.fieldOfStudy || "",
    startMonth: edu.startMonth || "",
    startYear: edu.startYear || "",
    endMonth: edu.endMonth || "",
    endYear: edu.endYear || "",
  }));

  next();
});


const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
