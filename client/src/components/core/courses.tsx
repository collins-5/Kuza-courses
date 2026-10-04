import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

function Courses() {
    const { courses, loading } = useCourses();

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 min-h-screen">
            <div className="w-full max-w-4xl bg-white p-6 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                    Available Courses
                </h1>

                {loading ? (
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Loading courses...
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Course Name</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell className="font-semibold text-slate-900">
                                            {course.name}
                                        </TableCell>
                                        <TableCell>{course.instructor}</TableCell>
                                        <TableCell>{course.duration}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                course.level === 'Beginner'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : course.level === 'Intermediate'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                                {course.level}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium">
                                            ${course.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link to={`/courses/${course._id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;