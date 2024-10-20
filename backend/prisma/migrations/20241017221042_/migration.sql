-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
