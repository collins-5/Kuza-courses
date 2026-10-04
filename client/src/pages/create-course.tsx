import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useCourseMutations } from "@/hooks/useCourses";
import { courseSchema, type CourseFormValues } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FormErrors = Partial<Record<keyof CourseFormValues, string>>;

export default function CourseCreate() {
  const navigate = useNavigate();
  const { createCourse, submitting } = useCourseMutations();

  const [formData, setFormData] = useState<CourseFormValues>({
    name: "",
    instructor: "",
    duration: "",
    price: 0,
    level: "Beginner"
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: keyof CourseFormValues, value: any) => {
    const fieldSchema = courseSchema.shape[fieldName];
    const result = fieldSchema.safeParse(value);
    
    setErrors((prev) => ({
      ...prev,
      [fieldName]: result.success ? undefined : result.error.issues[0]?.message
    }));
  };

  const handleBlur = (fieldName: keyof CourseFormValues) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleChange = (fieldName: keyof CourseFormValues, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = courseSchema.safeParse(formData);
  if (!result.success) {
    const fieldErrors: FormErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof CourseFormValues;
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    });
    setErrors(fieldErrors);
    setTouched({ name: true, instructor: true, duration: true, price: true, level: true });
    return;
  }

  const created = await createCourse(result.data);
  if (created) {
    navigate(`/courses/${created._id}`);
  }
};

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Fill out all parameters below to add this item to your curriculum registry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="name">Course Title Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="e.g. Next.js Foundations"
                className={touched.name && errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {touched.name && errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor Name</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
                onBlur={() => handleBlur("instructor")}
                placeholder="e.g. Jane Doe"
                className={touched.instructor && errors.instructor ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {touched.instructor && errors.instructor && (
                <p className="text-xs font-medium text-destructive">{errors.instructor}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration Intervals</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  onBlur={() => handleBlur("duration")}
                  placeholder="e.g. 14 hours"
                  className={touched.duration && errors.duration ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {touched.duration && errors.duration && (
                  <p className="text-xs font-medium text-destructive">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value === "" ? "" : Number(e.target.value))}
                  onBlur={() => handleBlur("price")}
                  placeholder="0.00"
                  className={touched.price && errors.price ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {touched.price && errors.price && (
                  <p className="text-xs font-medium text-destructive">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => handleChange("level", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

          </CardContent>
          <CardFooter className="flex gap-3 justify-end border-t pt-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Course"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
