// Import statements
import { $query, $update, Record, StableBTreeMap, match, Result, nat64, ic } from "azle";
import { v4 as uuidv4 } from "uuid";

// Define the Student and StudentPayload types
type Student = Record<{
    id: string;
    name: string;

    dateBirth: string;
    dateAdmission: string;
    course: string;
    courseType: string;
    location: string;
    parent: string;
    createdAt: nat64;
    updatedAt: nat64 | null;
}>;

type StudentPayload = Record<{
    id: string;
    name: string;
    dateBirth: string;
    dateAdmission: string;
    course: string;
    courseType: string;
    location: string;
    parent: string;
    parentNumber: nat64;
    createdAt: nat64;
    updatedAt: nat64 | null;
}>;

// Define the Opt type
type Opt<T> = { Some: T; None: null };

const studentsStorage = new StableBTreeMap<string, Student>(0, 44, 1024);

$update;
export function createStudent(payload: StudentPayload): Result<Student, string> {
    const student: Student = {
        ...payload,
        id: uuidv4(),
        createdAt: ic.time(),
        updatedAt: null, // Set updatedAt directly to null
        parent: ic.caller().toString(), // Assuming 'ic.caller()' returns a Principal
    };
    studentsStorage.insert(student.id, student);
    return Result.Ok<Student, string>(student);
}


$query;
export function getStudentById(id: string): Result<Student, string> {
    return match(studentsStorage.get(id), {
        Some: (student) => Result.Ok<Student, string>(student),
        None: () => Result.Err<Student, string>(`Student with id=${id} not found.`),
    });
}

$query;
export function getStudentByName(name: string): Result<Student, string> {
    const students = studentsStorage.values();
    const foundStudent = students.find((student) => student.name.toLowerCase() === name.toLowerCase());
    if (foundStudent) {
        return Result.Ok<Student, string>(foundStudent);
    }
    return Result.Err<Student, string>(`Student with name="${name}" not found.`);
}

$query;
export function getAllStudents(): Result<Student[], string> {
    return Result.Ok(studentsStorage.values());
}

$update;
export function updateStudent(id: string, payload: StudentPayload): Result<Student, string> {
    return match(studentsStorage.get(id), {
        Some: (existingStudent) => {
            const updatedStudent: Student = {
                ...existingStudent,
                ...payload,
                updatedAt: null, // Assuming Opt.None should be treated as null for updatedAt
            };
            studentsStorage.insert(updatedStudent.id, updatedStudent);
            return Result.Ok<Student, string>(updatedStudent);
        },
        None: () => Result.Err<Student, string>(`Student with id=${id} not found.`),
    });
}


$update;
export function deleteStudent(id: string): Result<Student, string> {
    return match(studentsStorage.get(id), {
        Some: (existingStudent) => {
            studentsStorage.remove(id);
            return Result.Ok<Student, string>(existingStudent);
        },
        None: () => Result.Err<Student, string>(`Student with id=${id} not found.`),
    });
}
$query;
export function getStudentsByCourse(course: string): Result<Student[], string> {
    const students = studentsStorage.values();
    const filteredStudents = students.filter((student) => student.course.toLowerCase() === course.toLowerCase());
    return Result.Ok(filteredStudents);
}

// New function 2: Get students by location
$query;
export function getStudentsByLocation(location: string): Result<Student[], string> {
    const students = studentsStorage.values();
    const filteredStudents = students.filter((student) => student.location.toLowerCase() === location.toLowerCase());
    return Result.Ok(filteredStudents);
}

// New function 3: Get students admitted after a certain date
$query;
export function getStudentsAdmittedAfter(date: string): Result<Student[], string> {
    const students = studentsStorage.values();
    const filteredStudents = students.filter((student) => student.dateAdmission > date);
    return Result.Ok(filteredStudents);
}

// New function 4: Count the number of students
$query;
export function countStudents(): Result<number, string> {
    const studentCount = studentsStorage.values().length;
    return Result.Ok(studentCount);
}

// New function 5: Update the course for a specific student
$update;
export function updateStudentCourse(id: string, newCourse: string): Result<Student, string> {
    return match(studentsStorage.get(id), {
        Some: (existingStudent) => {
            const updatedStudent: Student = {
                ...existingStudent,
                course: newCourse,
                updatedAt: existingStudent.updatedAt,
            };
            studentsStorage.insert(updatedStudent.id, updatedStudent);
            return Result.Ok<Student, string>(updatedStudent);
        },
        None: () => Result.Err<Student, string>(`Student with id=${id} not found.`),
    });
}





// New function 6: Get the parent of a specific student
$query;
export function getStudentParent(id: string): Result<string, string> {
    const student = studentsStorage.get(id);

    if (student.Some) {
        return Result.Ok(student.Some.parent);
    } else {
        return Result.Err(`Student with id=${id} not found.`);
    }
}


// New function 7: Get students by parent's name
$query;
export function getStudentsByParent(parentName: string): Result<Student[], string> {
    const students = studentsStorage.values();
    const filteredStudents = students.filter((student) => student.parent.toLowerCase() === parentName.toLowerCase());
    return Result.Ok(filteredStudents);
}

// New function 8: Get students by age (assuming dateBirth is in 'YYYY-MM-DD' format)
$query;
export function getStudentsByAge(age: number): Result<Student[], string> {
    const students = studentsStorage.values();
    const filteredStudents = students.filter((student) => {
        const birthYear = parseInt(student.dateBirth.split('-')[0], 10);
        const currentYear = new Date().getFullYear();
        const studentAge = currentYear - birthYear;
        return studentAge === age;
    });
    return Result.Ok(filteredStudents);
}

// New function 9: Check if a student with a specific ID exists
$query;
export function checkStudentExists(id: string): Result<boolean, string> {
    const studentExists = studentsStorage.get(id).Some !== null; // Check if Some is not null
    return Result.Ok(studentExists);
}



// New function 10: Get the average age of all students
$query;
export function getAverageStudentAge(): Result<number, string> {
    const students = studentsStorage.values();
    const totalAge = students.reduce((sum, student) => {
        const birthYear = parseInt(student.dateBirth.split('-')[0], 10);
        const currentYear = new Date().getFullYear();
        const studentAge = currentYear - birthYear;
        return sum + studentAge;
    }, 0);
    const averageAge = totalAge / students.length;
    return Result.Ok(averageAge);
}

globalThis.crypto = {
    //@ts-ignore
    getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(crypto.getRandomValues(new Uint8Array(1))[0]);
        }
    },
};
