import { $query, $update, Record, StableBTreeMap, match, Result, nat64, ic, Opt } from "azle";
import { v4 as uuidv4 } from "uuid";

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

const studentsStorage = new StableBTreeMap<string, Student>(0, 44, 1024);

$update;
export function createStudent(payload: StudentPayload): Result<Student, string> {
    const student: Student = {
        id: uuidv4(),
        createdAt: ic.time(),
        updatedAt: Opt.None,
        ...payload,
        parent: ic.caller(),
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
                updatedAt: Opt.some(ic.time()),
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

globalThis.crypto = {
    //@ts-ignore
    getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(crypto.getRandomValues(new Uint8Array(1))[0]);
        }
    },
};
