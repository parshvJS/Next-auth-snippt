import { z } from 'zod';

// Define the Zod schema
const examSchema = z.object({
  examName: z.string().min(10,"Please Enter Full Name of Exam !").max(200,"Please Enter Valid Exam Name !"),
  files: z.array(z.instanceof(File)).min(0).max(10).optional(),
});

export default examSchema;
