-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_userdata_id_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_userdata_id_fkey";

-- DropForeignKey
ALTER TABLE "UserData" DROP CONSTRAINT "UserData_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userdata_id_fkey" FOREIGN KEY ("userdata_id") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userdata_id_fkey" FOREIGN KEY ("userdata_id") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserData" ADD CONSTRAINT "UserData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
