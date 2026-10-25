"""
def a function
5
number 1 = 100
number 2 = 100
number 3 = 100
number 4 = 100
number 5 = 100
number 6 = 100

sum =500
"""
def sum():
    lst =[]
    user = int(input("Enter how meny number you wANT in list = "))
    for i in range(user) :
        choise = int(input(f"Enter element{i} = "))
        lst.append(choise)

    total = 0
    for i in range(len(lst)):
        total = total+lst[i]

    return f"Total is {total}"

s = sum()
print(s)