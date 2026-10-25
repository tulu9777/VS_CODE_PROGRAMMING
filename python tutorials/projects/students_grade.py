#initialising dictionary
student_grade = { }

#Add a new student
def add_student(name,grade):
    student_grade[name] = grade
    #[Tulu] = 100
    print(f"Added {name} with a {grade} ")
    #Added tulu with a 100

#update student
def update_student(name,grade):
    if name in student_grade:
        student_grade[name] = grade
        #Tulu = 200
        print(f"{name} with marks are updated {grade}")
        #Tulu with marks are updated 200

    else:
        print(f"{name} is not found ")

#Delete a student
def delete_student(name):
    if name in student_grade:
        del student_grade[name]
        print(f"{name} has been sucsessfully deleted ")

    else:
        print(f"{name} has been not found ")

#viwe all student
def display_all_students():
    if student_grade:
        for name, grade in student_grade.items():
            print(f"{name} : {grade} ")

    else:
        print("no students found/added")

def main():
    while True:
        print('\n student grade manegment system')
        print("1.Add student")
        print("2.Update student")
        print("3.Delete student")
        print("4.Viwe student")
        print("5. Exit")

        choise  = int(input("Enter your choise = "))
        if choise == 1:
            name  = input("Enter student name = ")
            grade = int(input("Enter student grade = "))
            add_student(name ,grade)

        elif choise == 2:
            name = input("Enter student name = ")
            grade = int(input("Enter student grade = "))
            update_student(name, grade)

        elif choise == 3:
            name = input("Enter student name = ")
            delete_student(name)

        elif choise == 4:
            display_all_students()

        elif choise == 5:
            print("Closing the program")
            break

        else:
            print("Invalid input/choise")

if __name__ == "__main__":
    main()