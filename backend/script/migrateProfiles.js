import mongoose from "mongoose";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Profile from "../models/profile.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


async function migrateProfiles() {
  try {
    await mongoose.connect(process.env.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB");
    console.log("dbURL from env:", process.env.dbURL);

    const profiles = await Profile.find();

    for (const profile of profiles) {
      let updated = false;

      // ✅ Ensure pastWork fields exist
      profile.pastWork = profile.pastWork.map((work) => {
        const updatedWork = { ...work._doc };

        if (updatedWork.title === undefined) updatedWork.title = "";
        if (updatedWork.employee_type === undefined) updatedWork.employee_type = "";
        if (updatedWork.company_or_organization === undefined) updatedWork.company_or_organization = "";
        if (updatedWork.position === undefined) updatedWork.position = "";
        if (updatedWork.startMonth === undefined) updatedWork.startMonth = "";
        if (updatedWork.startYear === undefined) updatedWork.startYear = "";
        if (updatedWork.endMonth === undefined) updatedWork.endMonth = "";
        if (updatedWork.endYear === undefined) updatedWork.endYear = "";
        if (updatedWork.location === undefined) updatedWork.location = "";
        if (updatedWork.location_type === undefined) updatedWork.location_type = "";

        return updatedWork;
      });

      // ✅ Ensure education fields exist
      profile.education = profile.education.map((edu) => {
        const updatedEdu = { ...edu._doc };

        if (updatedEdu.school === undefined) updatedEdu.school = "";
        if (updatedEdu.degree === undefined) updatedEdu.degree = "";
        if (updatedEdu.fieldOfStudy === undefined) updatedEdu.fieldOfStudy = "";
        if (updatedEdu.startMonth === undefined) updatedEdu.startMonth = "";
        if (updatedEdu.startYear === undefined) updatedEdu.startYear = "";
        if (updatedEdu.endMonth === undefined) updatedEdu.endMonth = "";
        if (updatedEdu.endYear === undefined) updatedEdu.endYear = "";

        return updatedEdu;
      });

      updated = true;

      if (updated) {
        await profile.save();
        console.log(`✅ Updated profile: ${profile._id}`);
      }
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateProfiles();
